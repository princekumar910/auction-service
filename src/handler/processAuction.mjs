import { closeAuction } from "../../lib/closeAuction.mjs"
import { getEndedAuction } from "../../lib/endedAuction.mjs"
async function processAuction(event , context){
   try {
      
      const auctionToClose = await getEndedAuction()
      console.log(auctionToClose)
      const auctionClosed = auctionToClose.map(auction => closeAuction(auction))
      await Promise.all(auctionClosed)
      return {closed : auctionClosed.length};            // we can do these because these function is not triggered by api gateway
   } catch (error) {
      console.error("error happened in the process auction module")
   }
}


export const handler = processAuction