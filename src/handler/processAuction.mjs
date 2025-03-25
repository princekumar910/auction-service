import { getEndedAuction } from "../../lib/endedAuctoin.mjs"
async function processAuction(event , context){
   console.log("processing")
   const auctionToClose = await getEndedAuction()
   console.log(auctionToClose)
}


export const handler = processAuction