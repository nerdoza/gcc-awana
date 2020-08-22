interface ClubUpdates {
  targetDate: Date
  type?: 'club' | 'general'
  general?: ClubSpecificUpdate
  cubbies?: ClubSpecificUpdate
  sparks?: ClubSpecificUpdate
  tnt?: ClubSpecificUpdate
}

interface ClubSpecificUpdate {
  text: string
  video?: string
}

declare enum Club {
  Puggles = 'p',
  Cubbies = 'c',
  Sparks = 's',
  BoysTNT = 'b',
  GirlsTNT = 'g',
  None = ''
}

declare enum Grade {
  Preschool = 'p',
  Kindergarten = 'k',
  First = '1',
  Second = '2',
  Third = '3',
  Fourth = '4',
  Fifth = '5',
  Sixth = '6'
}

declare enum Gender {
  Male = 'm',
  Female = 'f'
}

interface AuthUser {
  uid: string
  name: string
  email: string
  phoneNumber: string
}

interface User {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  updatedAt: string
}

interface UserRole {
  leader: boolean
  club: Club
  admin: boolean
  director: boolean
  super: boolean
}

interface CombinedUser extends User {
  role: UserRole
}

interface Clubber {
  firstName: string
  lastName: string
  birthday: string
  gender: Gender
  grade: Grade
  club: Club
  leader?: string
  parents?: string[]
}