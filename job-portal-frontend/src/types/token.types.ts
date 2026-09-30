export interface TokenPlan {
  id: string;
  name: string;
  tokens: number;
  priceCents: number;
  currency: string;
  description?: string;
}

export interface TokenTransaction {
  id: string;
  organizationId: string;
  type: 'CREDIT' | 'DEBIT' | 'ALLOCATE' | 'REFUND';
  amount: number;
  reason: string;
  balanceAfter: number;
  createdAt: string;
}

export interface TokenAllocation {
  id: string;
  organizationId: string;
  userId: string;
  allocated: number;
  used: number;
}
