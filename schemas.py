from pydantic import BaseModel

class PersonCreate(BaseModel):
    first_name: str
    last_name: str
    phone: str
    address: str
    national_id: str

class PersonResponse(PersonCreate):
    class Config:
        from_attributes = True
