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

interface ClubberBookBase {
  type: 'c' | 's' | 't' | 'p'
}

interface SparksBook extends ClubberBookBase {
  type: 's'
  skipFlight?: boolean
  flight?: string[]
  rankTest?: string[]
  redJewel1?: string[]
  greenJewel1?: string[]
  redJewel2?: string[]
  greenJewel2?: string[]
  redJewel3?: string[]
  greenJewel3?: string[]
  redJewel4?: string[]
  greenJewel4?: string[]
  rankTestReview?: string[]
  redJewel1Review?: string[]
  greenJewel1Review?: string[]
  redJewel2Review?: string[]
  greenJewel2Review?: string[]
  redJewel3Review?: string[]
  greenJewel3Review?: string[]
  redJewel4Review?: string[]
  greenJewel4Review?: string[]
  completed?: string
}

interface TnTBook extends ClubberBookBase {
  type: 't'
  chapter1section1?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter1section2?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter1section3?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter1section4?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter1section5?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter2section1?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter2section2?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter2section3?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter2section4?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter2section5?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter2section6?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter2section7?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter3section1?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter3section2?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter3section3?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter3section4?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter3section5?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter3section6?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter3section7?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter4section1?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter4section2?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter4section3?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter4section4?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter4section5?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter4section6?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  chapter4section7?: {explore?: string,  memorize?: string, review?: string, silver?: string, gold?: string}
  completed?: string
}

type ClubberBook = SparksBook | TnTBook | ClubberBookBase

interface ClubberRecord {
  cid: string
  clubber: Clubber
  book: ClubberBook
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