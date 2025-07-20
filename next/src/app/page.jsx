'use client'
import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable';
import Lottie from "lottie-react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

export default function Home() {
  const [loading, setLoading] = useState()
  const [data, setData] = useState(null);
  const [imgList, setImgList] = useState([]);
  const [counts, setCounts] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("catIndex");
      if (stored !== null) {
        setCounts(parseInt(stored));
      }
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("catIndex", counts.toString());
    }
  }, [counts]);

  const [view, setView] = useState('start')
  const [clickLike, setClickLike] = useState(false)
  const [clickDislike, setClickDislike] = useState(false)
  const [animationData, setAnimationData] = useState(null);
  const [dislikeAnimation, setDislikeAnimation] = useState(null)
  const [numberOfPic, setNumberOfPic] = useState()
  useEffect(() => { //Fetch Lotties
    const fetchAnimations = async () => {
      try {
        const [heartRes, dislikeRes] = await Promise.all([
          fetch('/assets/heart.json'),
          fetch('/assets/dislike.json'),
        ]);

        const [heartData, dislikeData] = await Promise.all([
          heartRes.json(),
          dislikeRes.json(),
        ]);

        setAnimationData(heartData);
        setDislikeAnimation(dislikeData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAnimations();
  }, []);


  const getCatImg = async () => { //Get data from CATAAS
    try {
      const res = await axios.get(`https://cataas.com/api/cats?limit=${numberOfPic}`)
      setData(res.data)
    } catch (e) {
      console.log('Error in Fetching data:', e)
    }
  }
  console.log(data, 'DATA')

  useEffect(() => { //When view becomes matching, it fetches the data with the entered number
    if (view == 'matching') getCatImg()
  }, [view])


  useEffect(() => { //Change view on completion
    if (data && counts >= data.length) {
      setView('view');
    }
  }, [counts, data]);

  useEffect(() => {
    if (imgList.length > 0) {
      localStorage.setItem("likedCats", JSON.stringify(imgList));
    }
  }, [imgList]);

  useEffect(() => {
    localStorage.setItem("catIndex", counts.toString());
  }, [counts]);

  useEffect(() => {
    if (data) {
      localStorage.setItem("catData", JSON.stringify(data));
    }
  }, [data]);


  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("likedCats") || "[]");
    const storedData = JSON.parse(localStorage.getItem("catData") || "null");

    if (storedList.length || storedData) {
      setImgList(storedList);
      setData(storedData);
      setView('matching');
    }
  }, []);

  const like = () => {
    if (!data || counts >= data.length) return;
    setClickLike(true); //Animation
    setImgList((prev) => [...prev, data[counts].id])
    setLoading(true) // Button Color
    setTimeout(() => {
      setClickLike(false); //Animation False
      setCounts(prev => prev + 1); //next image
      setLoading(false) //button color
    }, 1000);
  };

  const dislike = () => {
    if (!data || counts >= data.length) return;
    setClickDislike(true)  //lottie Animation start
    setLoading(true) // button color
    setTimeout(() => {
      setClickDislike(false) //lottie Animation stop
      setCounts(prev => prev + 1) // next image
      setLoading(false) //Button Color

    }, 1000)
  }

  const handlers = useSwipeable({
    onSwipedLeft: dislike,
    onSwipedRight: like,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  const reset = () => {
    setView('start');
    setImgList([]);
    setCounts(0);
    setNumberOfPic();
    setData();
    localStorage.removeItem("likedCats");
    localStorage.removeItem("catIndex");
    localStorage.removeItem("catData");
  };


  return (
    <div {...handlers} className='flex flex-col gap-5 min-h-screen bg-cover bg-center' style={{ backgroundImage: "url('/assets/paw.jpg')" }}>
      <p className='newFont text-5xl text-black text-center w-full outlined-text mt-10'>Paws & Preferences</p>
      {view == 'view' &&
        (
          <div className='flex w-full justify-center'>
            <p className='newFont text-black w-[80%] text-center p-2 rounded-2xl border-2 text-xl bg-white'>Total Liked Cats: {imgList.length}</p>
          </div>
        )
      }

      {view == 'start' && (
        <div className='flex flex-col gap-10 items-center justify-between h-[80vh]  text-center text-black text-2xl'>
          <div className='w-full flex flex-col  text-black gap-5 text-2xl'>
            <p className='newFont outlined-text'>Swipe Right to Like</p>
            <p className='newFont outlined-text'>Swipe Left to Dislike</p>
          </div>
          <div className='flex flex-col gap-5 items-center'>
            <p className='newFont outlined-text px-10'>Enter the Number of images you wish to see</p>
            <input className='w-[10rem] bg-white border-pink-500 border-5 text-black rounded-2xl p-5 text-center text-2xl' placeholder='10 - 15' value={numberOfPic} type='number' onChange={(e) => setNumberOfPic(e.target.value)} />
          </div>
          <button
            disabled={numberOfPic < 10 || numberOfPic > 15 || numberOfPic == undefined}
            style={{ backgroundColor: numberOfPic < 10 || numberOfPic > 15 || numberOfPic == undefined ? 'grey' : 'white' }}
            className=' bg-white text-2xl border-black border-3 rounded-2xl p-4 text-black ' onClick={() => setView('matching')}>
            Continue
          </button>
        </div>
      )}
      {view == 'matching' && (
        <div className='flex flex-col justify-around h-[70vh] items-center'>
          <div className='relative gap-10'>
            {data && data[counts] && (
              <div className='flex items-center justify-center'>
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
                  width={250}
                  height={250}
                  className="rounded-xl border-4 border-pink-400"
                />
              </div>
            )}
          </div>
          <div className='gap-20 justify-center w-full fixed bottom-10 hidden xl:flex '>
            <button
              disabled={loading}
              style={{ backgroundColor: loading ? '#8ec5ff' : '#155dfc' }}
              className='p-4 rounded-2xl cursor-pointer text-xl'
              onClick={dislike}>
              <HeartBrokenIcon />
            </button>
            <button
              disabled={loading}
              style={{ backgroundColor: loading ? '#fda5d5' : '#e60076' }}
              className='p-4 rounded-2xl cursor-pointer text-xl'
              onClick={like}>
              <FavoriteIcon />
            </button>
          </div>
        </div>
      )}
      {view == 'view' && (
        <div className='flex flex-col p-5 items-center justify-between min-h-screen text-3xl'>
          <div className="flex flex-wrap gap-5 justify-center">
            {imgList?.map((item) => (
              <Image
                key={item}
                src={`https://cataas.com/cat/${item}?position=center`}
                alt="Cat"
                width={100}
                height={100}
                className="rounded-xl h-auto w-full max-w-xs object-cover border-4 border-black"
              />
            ))}

          </div>
          <button
            className='sticky bottom-5 p-4 mt-6 rounded-2xl cursor-pointer border-1 text-xl w-full md:w-[20rem] border-gray-500 bg-red-500'
            onClick={reset}>
            Retry
          </button>
        </div>
      )}
    </div>
  )
}