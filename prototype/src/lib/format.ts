export function formatEGP(amount: number): string {
  return `EGP ${amount.toLocaleString('en-US')}`
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function whatsappLink(phoneDigits: string, message: string): string {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`
}

/** Egyptian mobile: 010, 011, 012 or 015 followed by 8 digits. */
export function isEgyptianMobile(phone: string): boolean {
  return /^01[0125]\d{8}$/.test(phone.replace(/[\s-]/g, ''))
}

/** 01012345678 -> 201012345678 (for wa.me links). */
export function toInternational(phone: string): string {
  return '2' + phone.replace(/[\s-]/g, '')
}
