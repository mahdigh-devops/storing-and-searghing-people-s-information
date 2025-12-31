const createForm = document.getElementById('createForm');
const createMessage = document.getElementById('createMessage');

createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    createMessage.textContent = "";
    const formData = {
        first_name: createForm.first_name.value,
        last_name: createForm.last_name.value,
        phone: createForm.phone.value,
        address: createForm.address.value,
        national_id: createForm.national_id.value
    };

    try {
        const res = await fetch("http://localhost:8000/persons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.detail || "خطا در ثبت اطلاعات");

        createMessage.style.color = "green";
        createMessage.textContent = "ثبت با موفقیت انجام شد!";
        createForm.reset();
    } catch (err) {
        createMessage.style.color = "red";
        createMessage.textContent = err.message;
    }
});

const searchBtn = document.getElementById('searchBtn');
const searchMessage = document.getElementById('searchMessage');
const personInfo = document.getElementById('personInfo');

searchBtn.addEventListener('click', async () => {
    const nationalId = document.getElementById('searchNationalId').value.trim();
    searchMessage.textContent = "";
    personInfo.style.display = "none";
    if (!nationalId) return;

    try {
        const res = await fetch(`http://localhost:8000/persons/${nationalId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.detail || "فرد پیدا نشد");

        personInfo.innerHTML = `
            <p><strong>نام:</strong> ${data.first_name}</p>
            <p><strong>نام خانوادگی:</strong> ${data.last_name}</p>
            <p><strong>شماره تماس:</strong> ${data.phone}</p>
            <p><strong>آدرس:</strong> ${data.address}</p>
            <p><strong>کد ملی:</strong> ${data.national_id}</p>
        `;
        personInfo.style.display = "block";
    } catch (err) {
        searchMessage.textContent = err.message;
    }
});