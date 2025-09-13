import { Target, Zap, Star, Edit, BookOpen, Award, Trophy, Clock, Users, Flame } from "lucide-react"

interface BadgeIconProps {
  iconName: string
  className?: string
}

export function BadgeIcon({ iconName, className = "w-6 h-6" }: BadgeIconProps) {
  const iconProps = { className }

  switch (iconName) {
    case "target":
      return <Target {...iconProps} />
    case "flame":
      return <Flame {...iconProps} />
    case "star":
      return <Star {...iconProps} />
    case "edit":
      return <Edit {...iconProps} />
    case "brain":
      return <BookOpen {...iconProps} />
    case "zap":
      return <Zap {...iconProps} />
    case "trophy":
      return <Trophy {...iconProps} />
    case "clock":
      return <Clock {...iconProps} />
    case "users":
      return <Users {...iconProps} />
    default:
      return <Award {...iconProps} />
  }
}
