'use client'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable';
import Lottie from "lottie-react";
// import animationData from "/assets/heart.json"; // Path to your Lottie JSON file

export default function Home(){
  const [data,setData]=useState()
  const [loading, setLoading] = useState()
  const [ imgList, setImgList] = useState([])
  const [count, setCount] = useState(0)
  const [counts, setCounts] = useState(0)
  const [view,setView]=useState('matching')
  const [clickLike,setClickLike]=useState(false)
  const [clickDislike,setClickDislike]=useState(false)

  const [animationData, setAnimationData] = useState(null);
  const [dislikeAnimation, setDislikeAnimation ]= useState(null)
  useEffect(() => {
    fetch('/assets/heart.json')
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch('/assets/dislike.json')
      .then((res) => res.json())
      .then(setDislikeAnimation)
      .catch(console.error);
  }, []);

  const getCatImg=async()=>{
    setLoading(true)
    try{
      const res = await axios.get('https://cataas.com/api/cats?limit=15')
      setData(res.data)
    } catch (e){
      console.log('Error in Fetching data:',e)
    } finally{
      setLoading(false)
    }
  }
  console.log(data,'DATA')

  useEffect(()=>{
    getCatImg()
  },[]) 

  const nextImage = (str) =>{
    if (str == 'like'){
      setImgList((prev)=>[...prev,data[counts].id])
      setCount(prev=>prev+1)
    } else {
      setCount(prev=>prev+1)
    }
  }

  useEffect(()=>{
    if (count == 12){
      setView('view')
    }
  },[count])

const like = () => {
  setClickLike(true); 
  setTimeout(() => {
    setCounts(prev => prev + 1);
    setClickLike(false);
    nextImage('like');
  }, 1000);
};

  const dislike=()=>{
    setClickDislike(true)
    setTimeout(()=>{
      setCounts(prev=> prev+1)
      setClickDislike(false)
      nextImage('dislike');
    },1000)
  }
  const handlers = useSwipeable({
    onSwipedLeft: () => like(),
    onSwipedRight: () => dislike(),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  const reset=()=>{
    setView('matching');
    setImgList('');
    setCount(0);
    setCounts(0)
  }
  console.log('Disable',loading)
  console.log('Image List:',imgList)
  console.log('Count:',count)
  return(
    <div className='flex justify-center items-center gap-5 min-h-screen bg-cover bg-center' style={{backgroundImage: "url('/assets/paw.jpg')"}}>
      {view =='matching' && (
        <>
          <div className='relative'>
            {data && (
              <div {...handlers} className='shadow-2xl flex items-center justify-center'>
                <div className="w-54 h-54 absolute">
                  {clickLike && (
                    <Lottie animationData={animationData} loop={true} />
                  )}
                </div>
                <div className="w-34 h-34 absolute">
                  {clickDislike && (
                    <Lottie animationData={dislikeAnimation} loop={true} />
                  )}
                  </div>
                <Image
                  src={`https://cataas.com/cat/${data[counts].id}?position=center`}
                  alt="Cat"
                  width={300}
                  height={300}
                  className="rounded-xl border-4 border-amber-700"
                />
              </div>
            )}
          </div>
          {/* <div className='flex gap-4 justify-center fixed bottom-10 w-full'>
            <button 
              disabled={loading}
              style={{backgroundColor: loading?'grey':'red'}}
              className='bg-pink-500 p-4 rounded-2xl cursor-pointer text-xl' 
              onClick={()=>like()}>
                Like
            </button> 
            <button 
              disabled={loading}
              style={{backgroundColor: loading?'grey':'blue'}}
              className='p-4 rounded-2xl cursor-pointer bg-blue-400 text-xl'
              onClick={()=>dislike()}>
                Dislike
            </button>
          </div> */}
        </>
      )}
      {view == 'view' &&( 
        <div className='flex flex-col p-5 items-center text-3xl min-h-screen'>
          <div className="flex flex-wrap gap-5 justify-center">
          <p className='text-black'>Total Liked Cats: {imgList.length}</p>
           {imgList.map((item) => (
              <Image
                key={item}
                src={`https://cataas.com/cat/${item}?position=center`}
                alt="Cat"
                width={150}
                height={150}
                className="rounded-xl h-auto w-full max-w-xs object-cover border-4 border-black"
              />
          ))}

          </div>
          <button className='p-4 mt-6 rounded-2xl cursor-pointer border-1 text-xl border-gray-500 bg-red-500' onClick={()=>reset()}>
            Retry
          </button>
        </div>
      )}
    </div>
  )
}