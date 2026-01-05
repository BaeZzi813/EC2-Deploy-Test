import {connectDB} from '@/util/database'

export default async function Home() {
  const client = await connectDB;
  const db = client.db()
  const tasks = await db.collection('tasks').find().toArray()
  return (
    <div className='w-xl mx-auto flex flex-col items-center mt-11'>
      <h1 className='text-4xl font-bold'>게시글 목록</h1>
      {tasks.map((task) => (
        <div className='mt-9' key={task._id.toString()}>
          <h3 className='text-2xl text-blue-600 font-bold'>{task.title}</h3>
          <p className='text-[16px] text-cyan-600 font-bold'>{task.content}</p>
        </div>
      ))}
    </div>
  );
}
