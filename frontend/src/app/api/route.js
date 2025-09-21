import Movies from "@/data/movies";

export const GET = async () => {
  
    console.log(Movies)
    const dt = await fetch(Movies);
    const posts = await dt.json()
    return Response.json(posts);
  
};
