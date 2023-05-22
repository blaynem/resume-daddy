import 'server-only';

export async function GET(request: Request) {
  return new Response('Hello, from API!');
}
