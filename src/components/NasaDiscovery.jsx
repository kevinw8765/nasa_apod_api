import React from 'react'
import {useState, useEffect} from 'react'

const NasaDiscovery = () => {
    
    const [imageData, setImageData] = useState(null)
    const [banList, setBanList] = useState([])
    const API_KEY = import.meta.env.VITE_APP_API_KEY

    const getRandomDate = () => {
        const start = new Date(1995, 5, 16).getTime()
        const end = new Date().getTime()
        const randomTime = start + Math.random() * (end - start)
        const randomDate = new Date(randomTime)
        
        return randomDate.toISOString().split('T')[0]
    };

    const fetchRandomImage = async () => {
        try {
            const randomDate = getRandomDate()
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${randomDate}`) 
            const data = await response.json()
            
            if(banList.includes(data.title)) {
                console.warn("Image banned, Fetching a new image")
                setImageData(null)
            } else {
                setImageData(data)
            }   
        }
        catch (error) {
            console.error("Error fetching NASA data: ", error)
        }
    }

    useEffect(() => {
        fetchRandomImage()
    }, [banList]) // Refetch when banList changes

    const handleBan = (title) => {
        setBanList((prevBanList) => {
            const newBanList = [...prevBanList, title]
            return newBanList
        })
    }
    
    const handleUnban = (title) => {
        setBanList((prevBanList) => {
            const newBanList = prevBanList.filter((item) => item !== title); // Remove the title from the ban list
            return newBanList; // Update the ban list state
        })
    }

    return (
        <div className='flex flex-col items-center p-6 bg-gray-900 text-white min-h-screen'>
            <h1 className='text-3xl font-bold mb-4'>NASA Discovery</h1>
            {imageData && (
                <div className ="max-w-lg text-center">
                    <img
                        src={imageData.url}
                        alt={imageData.title}
                        className="rounded-lg shadow-lg mb-4"
                    />
                    <h2
                        className='text-xl font-semibold cursor-pointer hover:text-red-400'
                        onClick={() => handleBan(imageData.title)}
                    >
                        {imageData.title}
                    </h2>
                    <p>{imageData.explanation}</p>
                    <p className='mt-2'>{imageData.date}</p>
                </div>
            )}
            <button
                onClick={fetchRandomImage}
                className='mt-4 px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg'
            >Discover More
            </button>

            <div className='mt-6'>
                <h3 className='text-lg font-bold'>Ban List:</h3>
                <ul>
                    {banList.map((item, index) => (
                        <li key = {index} className='text-red-400'>
                            {item}
                            <button
                                onClick={() => handleUnban(item)} 
                                className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                                Unban
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default NasaDiscovery