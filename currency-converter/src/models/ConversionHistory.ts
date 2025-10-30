export interface ConversionHistory {
  id: string;
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: Date;
}

export class ConversionHistoryModel {
  private history: ConversionHistory[] = [];

  addConversion(conversion: Omit<ConversionHistory, 'id' | 'timestamp'>): ConversionHistory {
    const newConversion: ConversionHistory = {
      ...conversion,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    this.history.push(newConversion);
    return newConversion;
  }

  getHistory(limit: number = 10): ConversionHistory[] {
    return this.history.slice(-limit);
  }

  getConversionById(id: string): ConversionHistory | undefined {
    return this.history.find(conv => conv.id === id);
  }
}
