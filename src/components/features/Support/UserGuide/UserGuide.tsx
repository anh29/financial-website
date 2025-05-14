import { Card, Button, Badge, LoadingSpinner } from '../../../common'
import styles from './UserGuide.module.css'

interface GuideSection {
  title: string
  icon: React.ReactNode
  steps: string[]
  content: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export const UserGuide: React.FC = () => {
  const isLoading = false
  const guideSections: GuideSection[] = []

  const getDifficultyBadge = (difficulty: string) => {
    const variants = {
      beginner: 'success',
      intermediate: 'primary',
      advanced: 'warning'
    } as const

    return <Badge variant={variants[difficulty as keyof typeof variants]}>{difficulty}</Badge>
  }

  return (
    <div className={styles.guidePage}>
      <div className={styles.guideContainer}>
        <h1>User Guide</h1>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner size='large' />
          </div>
        ) : (
          <div className={styles.guideSections}>
            {guideSections.map((section, index) => (
              <Card key={index} className={styles.guideSection}>
                <div className={styles.sectionHeader}>
                  <h2>{section.title}</h2>
                  {getDifficultyBadge(section.difficulty)}
                </div>
                <p>{section.content}</p>
                <Button variant='outline'>Read More</Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserGuide
