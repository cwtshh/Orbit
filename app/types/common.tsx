export interface User {
    _id: string,
    email: string,
    name: string,
    username: string,
};

export interface RegisterBody {
    username: string;
    name: string;
    email: string;
    password: string;
};




