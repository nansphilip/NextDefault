// ==============================================
//               Database interfaces
// ==============================================
export interface UserDatabase {
    id: string,

    firstname: string,
    lastname: string,
    image: string | null,
    
    email: string,
    emailVerified: Date | null,
    newEmail: string | null,
    
    phone: string | null,
    phoneVerified: Date | null,
    
    password: string,
    
    createdAt: Date,
    updatedAt: Date
}

export interface SessionDatabase {
    id: string,

    userId: string | null,
    clientId: string,
    expires: Date,
  
    createdAt: Date,
    updatedAt: Date
}

export interface TokenDatabase {
    id: string,

    clientId: string,
    email: string | null,
    
    token: string,
    type: "VERIFY" | "CSRF",
    expires: Date,

    createdAt: Date,
    updatedAt: Date
}

// ==============================================
//               Cookies interfaces
// ==============================================
interface CookieSettings {
    created: Date,
    updated: Date,
    expires: Date
}

export interface DataContent {
    [key: string]: any
}

export interface DataCookieContent {
    data: DataContent
}

export interface DataCookies extends DataCookieContent {
    settings: CookieSettings
}

// ==============================================
//               Client interfaces
// ==============================================
export interface ClientContent {
    clientId: string,
}

export interface ClientCookieContent {
    data: ClientContent
}

export interface ClientCookies extends ClientCookieContent {
    settings: CookieSettings
}

// ==============================================
//               Client interfaces
// ==============================================
export interface CsrfContent {
    csrf: string,
}

export interface CsrfCookieContent {
    data: CsrfContent
}

export interface CsrfCookies extends CsrfCookieContent {
    settings: CookieSettings
}

// ==============================================
//               Session interfaces
// ==============================================
interface SessionContent {
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    emailVerified: Date | null,
    newEmail: string | null,
}

export interface SessionCookieContent {
    data: SessionContent
}

export interface SessionCookies extends SessionCookieContent {
    settings: CookieSettings
}

export interface UpdateSessionContent {
    id?: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    emailVerified?: Date | null,
    newEmail?: string | null,
}