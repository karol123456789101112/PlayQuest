
export async function login(data) {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Błąd logowania');
    }

    return await response.json();
  }


export async function register(formData) {
    console.log('Form data to send:', formData);
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Błąd rejestracji');
    }

    const result = await response.json();
    console.log('Odpowiedź z backendu:', result);
    return result;
}


