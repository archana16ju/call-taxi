import type { Payload } from 'payload'

export const sendWhatsAppMessage = async (payload: Payload, phone: string, name: string, link: string) => {
  try {
    const settings = await payload.findGlobal({
      slug: 'general-settings',
    })

    const endpoint = (settings as any).whatsappConfig?.apiEndpoint
    const apiKey = (settings as any).whatsappConfig?.apiKey
    const template = (settings as any).whatsappConfig?.messageTemplate || 'Hello {name}, your ride has started! Track your live location here: {link}'

    if (!endpoint) {
      console.log('WhatsApp API Endpoint not configured. Skipping notification.')
      return
    }

    const message = template.replace('{name}', name).replace('{link}', link)

    console.log(`Sending WhatsApp to ${phone}: ${message}`)

    // Example of a custom API call
    // Most APIs expect a POST with JSON
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`, // Or whatever header your API uses
        'x-api-key': apiKey, // Many custom APIs use this
      },
      body: JSON.stringify({
        phone: phone,
        message: message,
        // Add other params your specific API needs here
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`WhatsApp API error: ${response.status} - ${errorText}`)
    } else {
      console.log('WhatsApp message sent successfully.')
    }
  } catch (e) {
    console.error('Error sending WhatsApp message:', e)
  }
}
