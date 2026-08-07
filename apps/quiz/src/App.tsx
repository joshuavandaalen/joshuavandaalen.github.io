import {
  Badge,
  BadgeRow,
  BrowserBanner,
  DarkModeToggle,
  FlyingSquirrel,
  FooterLinks,
  GlowingTitle,
  MidiPlayer,
  PageContainer,
  RetroProvider,
  SiteFooter,
  SiteHeader,
  SparkleEmitter,
  StarfieldBackground,
} from 'retro-ui-kit-PLACEHOLDER';

import { QuestionScreen } from './screens/QuestionScreen';
import { ResultScreen } from './screens/ResultScreen';
import { StartScreen } from './screens/StartScreen';
import { useQuiz } from './quiz/useQuiz';

export function App() {
  const quiz = useQuiz();

  return (
    <RetroProvider>
      <StarfieldBackground density={120} twinkle />
      <FlyingSquirrel />
      <SparkleEmitter interval={6000} initialBurst={2} />
      <DarkModeToggle />

      <PageContainer>
        <BrowserBanner
          text="⚡ CERTIFIED 100% CLOUD NATIVE ⚡ NOW WITH KUBERNETES ⚡"
          icon="☁️"
        />

        <SiteHeader subtitle="☁️ Azure ☁️ Kubernetes ☁️ Scenario questions with cited answers ☁️ Practice until it sticks ☁️">
          <GlowingTitle>⎈ DEVOPS DOJO ⎈</GlowingTitle>
        </SiteHeader>

        <main>
          {quiz.phase === 'start' && (
            <StartScreen
              onStart={(topic, count) => quiz.start(topic, count)}
            />
          )}

          {quiz.phase === 'question' && quiz.question && (
            <QuestionScreen
              question={quiz.question}
              index={quiz.index}
              total={quiz.questions.length}
              selected={quiz.selected}
              revealed={quiz.revealed}
              onSelect={quiz.select}
              onSubmit={quiz.submit}
              onNext={quiz.next}
            />
          )}

          {quiz.phase === 'result' && (
            <ResultScreen
              score={quiz.score}
              total={quiz.questions.length}
              breakdown={quiz.breakdown}
              missed={quiz.missed}
              onRestart={quiz.restart}
            />
          )}
        </main>

        <SiteFooter>
          <BadgeRow>
            <Badge>Built with retro-ui</Badge>
            <Badge variant="silver">Answers cited to the docs</Badge>
            <Badge>Best viewed in Netscape</Badge>
          </BadgeRow>

          <FooterLinks
            links={[
              { label: '📚 DOCS', href: '/' },
              { label: '🕹️ THE 90s SITE', href: '/retro/' },
              {
                label: '☁️ AZURE DOCS',
                href: 'https://learn.microsoft.com/azure/aks/',
                external: true,
              },
              {
                label: '⎈ K8S DOCS',
                href: 'https://kubernetes.io/docs/',
                external: true,
              },
            ]}
          />
        </SiteFooter>
      </PageContainer>

      <MidiPlayer trackName="devops-dojo.mid" />
    </RetroProvider>
  );
}
