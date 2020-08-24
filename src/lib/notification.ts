export const sendNotification = async (notification: AppNotification, apiKey: string) => {
  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    body: JSON.stringify({
      notification: {
        title: notification.title,
        text: notification.text
      },
      to: '/topics/all'
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${apiKey}`
    }
  })

  if (!response.ok) {
    console.error(response)
    throw new Error('Response Error')
  }
}
