export type ExchangeStats = {
  queueName: string,
  messagesCount: number,
  consumersCount?: number,
}

const getStats = (queueName: string): ExchangeStats => {
  return {
    queueName,
    messagesCount: 14,
    consumersCount: 2
  }
}

const killConsumer = (exchange: ExchangeStats) => {
  let newStats = exchange;
  newStats.consumersCount = 0;
  return newStats;
}

const initConsumer = (exchange: ExchangeStats) => {
  let newStats = exchange;
  newStats.consumersCount=+1;
  return newStats;
}

export const handleStats = (stats: ExchangeStats) => {
  let newStats = stats;
  const {consumersCount, messagesCount} = stats

  if(!consumersCount || consumersCount < 1 && messagesCount > 0) {
    if(!messagesCount || messagesCount < 1) {
      return stats;
    }
    newStats.consumersCount = 1;
    return newStats
  }

  if(consumersCount < 1 && messagesCount < 1) {
    return stats // Do Nothing
  }

  if(consumersCount > 0 && messagesCount > 0) {
    return stats // Do Nothing
  }

  if(consumersCount == 0 || !consumersCount && messagesCount > 0) {
    
  }

  if(consumersCount > 0 && messagesCount < 1) {
    newStats.consumersCount = 0
    return newStats
  }
  
  return stats
}