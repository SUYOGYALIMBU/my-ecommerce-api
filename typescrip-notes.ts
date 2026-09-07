let user: { name: string } = { name: "ram" }


interface User {
    name: string
}

interface User {
    address?: string
}


let user2: User = { name: "ram", }

user2.address = "balaju"


interface Course {
    name: string,
    durationInMonths: number,
    startDate?: string
}


let course1: Course = {
    name: "mern",
    durationInMonths: 3,
    startDate: "july 2026"
}

// course1.endDate: "aug 2026"

delete course1.startDate



// let err: { email?: string } = {  };
let err: Record<string, string> = {};

err["email"] = "email is reuired"
err["password"] = "email is reuired"

err["phone"] = "phone is reuired"
err.phone = "phone is reuired"