import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import {
  brandBar,
  brandText,
  button,
  container,
  footer,
  h1,
  hr,
  link,
  main,
  text,
} from './styles'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Confirma tu correo y empieza a aprender alemán</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>
          <Link href={siteUrl} style={brandText}>
            {siteName}
          </Link>
        </Section>
        <Heading style={h1}>Confirma tu correo</Heading>
        <Text style={text}>
          ¡Gracias por registrarte! Confirma tu dirección ({recipient}) para
          guardar tu progreso y seguir practicando alemán desde cualquier
          dispositivo.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirmar mi correo
        </Button>
        <Hr style={hr} />
        <Text style={footer}>
          Si no creaste esta cuenta, puedes ignorar este mensaje.{' '}
          <Link href={siteUrl} style={link}>
            {siteName}
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail
