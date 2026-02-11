export const LeadStatus = [
    'not contacted',
    'contacted',
    'inspection',
    'damages',
    'follow up',
    'closed - won',
    'closed - lost',
    'contractor',
    'not interested',
    'do not contact',
] as const;

export const StatusColors: Record<LeadStatus, string> = {
    'not contacted': '#04be04',
    'contacted': '#faf605',
    'inspection': '#ff7b00',
    'damages': '#ff0000',
    'follow up': '#f70098',
    'closed - won': '#0c6800',
    'closed - lost': '#2c2c2c',
    'contractor': '#2c2c2c',
    'not interested': '#2c2c2c',
    'do not contact': '#2c2c2c',
};

export type LeadStatus = (typeof LeadStatus)[number]; 

interface Lead {
    /* basic lead info */
    id: string;
    fullName: string;
    email: string;
    phoneNumber: number;
    address: string;
    datedAdded: Date;
    status: LeadStatus;
    /** Geographic coordinates of the lead's address for knock map tracker */
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    notes?: string;
    preferredContactMethod: 'email' | 'phone' | 'none'; /*set up for marketing/contact tasks*/
    dateLastContacted: Date;
}

export default Lead;