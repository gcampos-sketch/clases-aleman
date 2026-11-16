// Shared brand styles for auth emails (Adereso Dark palette, light email body).
export const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
}

export const container = {
  padding: '32px 28px',
  maxWidth: '560px',
}

export const brandBar = {
  backgroundColor: '#0C0C0D',
  borderRadius: '14px',
  padding: '18px 22px',
  margin: '0 0 28px',
}

export const brandText = {
  color: '#FFD540',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  letterSpacing: '0.4px',
  margin: '0',
  textDecoration: 'none',
}

export const h1 = {
  fontSize: '23px',
  fontWeight: 'bold' as const,
  color: '#0C0C0D',
  margin: '0 0 18px',
  lineHeight: '1.25',
}

export const text = {
  fontSize: '15px',
  color: '#55575d',
  lineHeight: '1.6',
  margin: '0 0 22px',
}

export const link = { color: '#0C0C0D', textDecoration: 'underline' }

export const button = {
  backgroundColor: '#FFD540',
  color: '#0C0C0D',
  fontSize: '15px',
  fontWeight: 'bold' as const,
  borderRadius: '10px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block',
}

export const code = {
  fontFamily: 'Courier, monospace',
  fontSize: '26px',
  fontWeight: 'bold' as const,
  letterSpacing: '4px',
  color: '#0C0C0D',
  backgroundColor: '#f6f6f4',
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '0 0 28px',
}

export const hr = {
  borderColor: '#ececec',
  margin: '32px 0 18px',
}

export const footer = { fontSize: '12px', color: '#999999', margin: '0' }
