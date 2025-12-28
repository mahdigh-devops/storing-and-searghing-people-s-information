from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas
from database import engine, get_db

# ایجاد جداول دیتابیس
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # برای تست محلی کافیست
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------- افزودن فرد -----------------------
@app.post("/persons", response_model=schemas.PersonResponse)
def create_person(person: schemas.PersonCreate, db: Session = Depends(get_db)):

    # بررسی یکتا بودن کد ملی
    db_person = db.query(models.Person).filter(models.Person.national_id == person.national_id).first()
    if db_person:
        raise HTTPException(status_code=400, detail="این کد ملی قبلاً ثبت شده است.")

    new_person = models.Person(
        first_name=person.first_name,
        last_name=person.last_name,
        phone=person.phone,
        address=person.address,
        national_id=person.national_id
    )
    db.add(new_person)
    db.commit()
    db.refresh(new_person)
    return new_person

# ----------------------- دریافت اطلاعات با کدملی -----------------------
@app.get("/persons/{national_id}", response_model=schemas.PersonResponse)
def get_person(national_id: str, db: Session = Depends(get_db)):

    person = db.query(models.Person).filter(models.Person.national_id == national_id).first()

    if not person:
        raise HTTPException(status_code=404, detail="فرد یافت نشد.")

    return person
