import Video from '../models/Video'

export const deleteAllVideosByChannel = (channelId) =>{
    return Video.deleteMany({channel: channelId})
}

