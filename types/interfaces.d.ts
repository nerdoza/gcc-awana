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
}

interface UserRole {
  leader: boolean
  club: Club
  admin: boolean
  director: boolean
  super: boolean
}

interface AppUser {
  uid: string
  user: User
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

interface ClubberRecord {
  cid: string
  clubber: Clubber
}

interface ShelbyExportedFlatClubber {
  childFirstName: string
  childLastName: string
  childBirthDate: string
  childGender: 'Female' | 'Male'
  childClub: 'AK20CU-Cubbie' | 'AK20SP-SPARKS' | 'AK20GL-T&T GIRLS' | 'AK20BY-T&T BOYS'
  email: string
  parentGuardianNameFirstName: string
  parentGuardianNameLastName: string
  phoneNumber: string
}

interface AppNotification {
  title: string
  text: string
  createdAt: number
  sentAt?: number
}

interface AppNotificationRecord {
  nid: string,
  notification: AppNotification
}

interface ClubUpdate {
  postAt: number
  title: string
  general?: ClubSpecificUpdate
  cubbies?: ClubSpecificUpdate
  sparks?: ClubSpecificUpdate
  tnt?: ClubSpecificUpdate
}

interface RawClubUpdate {
  postAt: string
  title: string
  general?: ClubSpecificUpdate
  cubbies?: ClubSpecificUpdate
  sparks?: ClubSpecificUpdate
  tnt?: ClubSpecificUpdate
}

interface ClubSpecificUpdate {
  text: string
  video?: string
}

interface ClubUpdateRecord {
  uid: string,
  update: ClubUpdate
}