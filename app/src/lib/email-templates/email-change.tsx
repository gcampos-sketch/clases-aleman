import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
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
  main,
  text,
} from './styles'

interface EmailChangeEmailProps {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Confirma tu nuevo correo en {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>
          <Text style={brandText}>{siteName}</Text>
        </Section>
        <Heading style={h1}>Confirma tu nuevo correo</Heading>
        <Text style={text}>
          Pediste cambiar tu correo de {oldEmail || email} a{' '}
          {newEmail || email}. Confirma el cambio para seguir accediendo a tu
          cuenta.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirmar el cambio
        </Button>
        <Hr style={hr} />
        <Text style={footer}>
          Si no pediste este cambio, ignora este mensaje y tu correo actual se
          mantendrá.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail
