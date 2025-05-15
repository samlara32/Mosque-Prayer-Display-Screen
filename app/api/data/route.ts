import data from "../example-mosque/example-mosque-api-response.json"

export async function GET(request: Request) {
  return Response.json(data)
}
