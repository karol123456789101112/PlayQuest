
export async function login(data) {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Logging error');
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
      throw new Error('Register error');
    }

    const result = await response.json();
    return result;
}


