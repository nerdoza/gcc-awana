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

declare type ClubsType = 'p' | 'c' | 's' | 'b' | 'g' | ''

interface UserRole {
  leader: boolean
  club: ClubsType
  admin: boolean
  director: boolean
  super: boolean
}