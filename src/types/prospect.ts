interface Prospect {
    fullName: string;
    email: string;
    phoneNumber: number;
    address: string;
    preferredContactMethod: 'email' | 'phone' | 'none';
    notes?: string;
    insuranceProvider: string;
    claimNumber: string;
    contractSigned: boolean;
    otherDocsSigned: boolean;
    DamageType: 'wind' | 'hail' | 'other';
    roofDamage: boolean;
}
