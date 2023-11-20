import { json } from '@sveltejs/kit'
import axios from 'axios';

// /api/newsletter GET

export async function GET(event) {
  const options: ResponseInit = {
    status: 418,
    headers: {
      X: 'Gon give it to ya',
    }
  }

  return new Response('Hello', options)
}


export async function POST(event) {
    const data = await event.request.json()
    
    console.log('data')

    axios.post(
        'https://vrpms-rpke.vercel.app/api/vrp/ga', data,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
  
    // it's common to return JSON, so SvelteKit has a helper
    return json({ success: true })
  }
  