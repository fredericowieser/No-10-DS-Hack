export interface CallLog {
  id: string;
  priority: 'high' | 'medium' | 'low' | 'pending' | 'none';
  patientName: string;
  dateOfBirth: string;
  nhsNumber: string;
  callerId: string;
  duration: string;
  timestamp: string;
  status: 'completed' | 'dropped' | 'pending';
  summary: string;
  symptoms: string[];
  transcript: string;
  agentNotes: string;
}

export const mockCallLogs: CallLog[] = [
  {
    id: '1',
    priority: 'high',
    patientName: 'AA BB',
    dateOfBirth: '01/01/2000',
    nhsNumber: '123 456 7890',
    callerId: '1',
    duration: '5m 23s',
    timestamp: '03/08/2025 13:56',
    status: 'completed',
    summary: 'The agent, Alex, is assisting a user, AA BB, who is experiencing sudden hearing issues, specifically a muffled sound in their left ear that worsened gradually over a few days. The user denies experiencing other symptoms like ear pain, dizziness, or ringing in the ear, and reports no recent colds, flu, sinus infections, or exposure to loud noises. The user also states they have no past ear problems or hearing issues, and no known allergies. They did use over-the-counter ear drops recently, but do not recall the name.',
    symptoms: ['Hearing loss', 'Muffled hearing'],
    transcript: 'Agent: Hello, this is Alex from NHS Eleven-labs health practice. How can I assist you today?\nPatient: Hi, Alex. Yes, I\'m calling because I\'m having some issues with my hearing recently.\nAgent: I\'m sorry to hear that you\'re experiencing issues with your hearing. To ensure I can assist you effectively, could you please provide your full name and date of birth?\nPatient: Yeah, it\'s AA and my last name is BB. My date of birth is the 1st of January 2000.\nAgent: Thank you, AA. I have that as AA BB, date of birth first of January two thousand. Could you describe the hearing issues you\'re experiencing in more detail?\nPatient: Yeah, it\'s been a bit sudden actually.\nAgent: Okay, so the hearing issues came on suddenly. When did you first notice the change in your hearing?\nPatient: Yeah it was all of a sudden I can hear so actually it was more gradual. Eventually it was getting a bit worse and worse throughout the days and then today I woke up and I couldn\'t really hear from one side.\nAgent: Okay, I understand. So it started gradually, getting worse over a few days, and today you woke up with significant hearing loss on one side. Can you tell me which ear is affected?\nPatient: Yeah, it\'s the left ear.\nAgent: Thank you. And can you describe the hearing loss? Is it a complete loss of hearing, or is it more like a muffled sound?\nPatient: It\'s definitely a muffled sound. I think it probably needs an appointment to clear it up.\nAgent: Okay, it sounds like you have a sense of what might be causing it. Have you experienced any other symptoms along with the muffled hearing in your left ear, such as ear pain, dizziness, ringing in your ear, or any discharge?\nPatient: No not at all.\nAgent: Okay, no other symptoms like ear pain, dizziness, or ringing in the ear. Have you had any recent colds, flu, or sinus infections?\nPatient: No\nAgent: Okay. Have you been exposed to any loud noises recently, like at a concert or through headphones?\nPatient: No\nAgent: Alright. Have you ever had any ear problems in the past, such as ear infections, excessive earwax, or any other hearing-related issues?\nPatient: No I\'m quite healthy.\nAgent: Okay, so no past ear problems or hearing issues. Just a few more questions, AA. Do you have any known allergies to medications or other substances?\nPatient: No I\'m not taking any medications but I did take some over-the-counter ear drops in my ears in case it was a blockage.\nAgent: I see, so you\'re not taking any regular medications, but you did use some over-the-counter ear drops recently. Do you recall the name of the ear drops you used?\nPatient: No.',
    agentNotes: 'Urgent - requires immediate GP assessment'
  },
  {
    id: '2',
    priority: 'medium',
    patientName: 'Sarah Jones',
    dateOfBirth: '15/03/1985',
    nhsNumber: '123 456 7891',
    callerId: '+44 7700 900124',
    duration: '3m 45s',
    timestamp: '16/03/2025 12:30',
    status: 'completed',
    summary: 'Routine medication query regarding dosage adjustment for hypertension medication.',
    symptoms: ['High blood pressure'],
    transcript: 'Patient: I wanted to check about my blood pressure medication...\nAgent: What specific concerns do you have?\nPatient: The dosage seems too high, I\'ve been feeling dizzy...',
    agentNotes: 'Advised to speak with GP about dosage adjustment. Appointment booked for next week.'
  },
  {
    id: '3',
    priority: 'low',
    patientName: 'Emma Wilson',
    dateOfBirth: '22/11/1992',
    nhsNumber: '123 456 7892',
    callerId: '+44 7700 900125',
    duration: '2m 12s',
    timestamp: '16/03/2025 11:00',
    status: 'dropped',
    summary: 'Call dropped during initial assessment. No callback received.',
    symptoms: [],
    transcript: 'Patient: Hello, I wanted to ask about...\n[Call dropped]',
    agentNotes: 'Call dropped early. Attempted callback unsuccessful.'
  },
  {
    id: '4',
    priority: 'high',
    patientName: 'Michael Brown',
    dateOfBirth: '08/07/1978',
    nhsNumber: '123 456 7893',
    callerId: '+44 7700 900126',
    duration: '12m 34s',
    timestamp: '16/03/2025 15:20',
    status: 'completed',
    summary: 'Patient experiencing severe headaches with nausea and vomiting. Symptoms started suddenly this morning.',
    symptoms: ['Severe headache', 'Nausea', 'Vomiting'],
    transcript: 'Patient: I\'ve been having severe headaches with nausea since this morning...\nAgent: Can you describe the pain? Is it throbbing or constant?\nPatient: It\'s like nothing I\'ve ever experienced...',
    agentNotes: 'Urgent referral to A&E recommended. Patient advised to seek immediate medical attention.'
  },
  {
    id: '5',
    priority: 'low',
    patientName: 'James Thompson',
    dateOfBirth: '12/09/1956',
    nhsNumber: '123 456 7894',
    callerId: '+44 7700 900127',
    duration: '4m 18s',
    timestamp: '16/03/2025 14:45',
    status: 'completed',
    summary: 'Follow-up call regarding recent blood test results. All levels within normal range.',
    symptoms: [],
    transcript: 'Patient: I wanted to check on my blood test results from last week...\nAgent: I can see your results here. Everything looks normal...',
    agentNotes: 'Routine follow-up. Patient reassured. No further action required.'
  },
  {
    id: '6',
    priority: 'medium',
    patientName: 'Rachel Green',
    dateOfBirth: '28/02/1991',
    nhsNumber: '123 456 7895',
    callerId: '+44 7700 900128',
    duration: '6m 52s',
    timestamp: '16/03/2025 13:15',
    status: 'completed',
    summary: 'Patient reporting persistent cough lasting 3 weeks with mild fever and fatigue.',
    symptoms: ['Persistent cough', 'Mild fever', 'Fatigue'],
    transcript: 'Patient: I\'ve had this cough for about 3 weeks now...\nAgent: Have you had any fever or other symptoms?\nPatient: Yes, mild fever and I\'ve been quite tired...',
    agentNotes: 'Possible chest infection. GP appointment scheduled for tomorrow.'
  },
  {
    id: '7',
    priority: 'high',
    patientName: 'David Miller',
    dateOfBirth: '05/12/1962',
    nhsNumber: '123 456 7896',
    callerId: '+44 7700 900129',
    duration: '8m 41s',
    timestamp: '16/03/2025 16:00',
    status: 'completed',
    summary: 'Elderly patient with chest pain and shortness of breath. History of heart disease.',
    symptoms: ['Chest pain', 'Shortness of breath', 'Dizziness'],
    transcript: 'Patient: I\'m having chest pain and finding it hard to breathe...\nAgent: Mr Miller, this sounds serious. When did this start?\nPatient: About an hour ago...',
    agentNotes: 'URGENT - Ambulance called. Patient advised not to drive. Family contacted.'
  },
  {
    id: '8',
    priority: 'low',
    patientName: 'Sophie Davis',
    dateOfBirth: '18/06/1988',
    nhsNumber: '123 456 7897',
    callerId: '+44 7700 900130',
    duration: '3m 27s',
    timestamp: '16/03/2025 10:30',
    status: 'completed',
    summary: 'Routine prescription renewal request for contraceptive medication.',
    symptoms: [],
    transcript: 'Patient: I need to renew my prescription for the contraceptive pill...\nAgent: I can help with that. Let me check your records...',
    agentNotes: 'Prescription renewed and sent to preferred pharmacy. Review due in 6 months.'
  },
  {
    id: '9',
    priority: 'medium',
    patientName: 'Thomas Anderson',
    dateOfBirth: '14/04/1975',
    nhsNumber: '123 456 7898',
    callerId: '+44 7700 900131',
    duration: '7m 15s',
    timestamp: '16/03/2025 11:45',
    status: 'completed',
    summary: 'Patient concerned about skin rash that appeared after starting new medication.',
    symptoms: ['Skin rash', 'Itching'],
    transcript: 'Patient: I\'ve developed a rash since starting my new medication...\nAgent: Can you describe the rash? Is it itchy?\nPatient: Yes, it\'s quite itchy and spreading...',
    agentNotes: 'Possible allergic reaction. Advised to stop medication immediately. GP appointment booked.'
  },
  {
    id: '10',
    priority: 'low',
    patientName: 'Lisa Parker',
    dateOfBirth: '30/11/1983',
    nhsNumber: '123 456 7899',
    callerId: '+44 7700 900132',
    duration: '2m 43s',
    timestamp: '16/03/2025 09:15',
    status: 'completed',
    summary: 'General health inquiry about vaccination schedules for upcoming travel.',
    symptoms: [],
    transcript: 'Patient: I\'m traveling to Thailand next month and need travel vaccinations...\nAgent: Let me check what vaccinations you\'ll need...',
    agentNotes: 'Travel health information provided. Referred to travel clinic for vaccinations.'
  },
  {
    id: '11',
    priority: 'high',
    patientName: 'Robert Clark',
    dateOfBirth: '22/01/1969',
    nhsNumber: '123 456 7900',
    callerId: '+44 7700 900133',
    duration: '9m 18s',
    timestamp: '16/03/2025 17:30',
    status: 'completed',
    summary: 'Patient experiencing severe abdominal pain with vomiting. Possible appendicitis.',
    symptoms: ['Severe abdominal pain', 'Vomiting', 'Fever'],
    transcript: 'Patient: I have really bad stomach pain that started this afternoon...\nAgent: Where exactly is the pain located?\nPatient: It started around my belly button but now it\'s on the right side...',
    agentNotes: 'URGENT - Possible appendicitis. Patient directed to A&E immediately.'
  },
  {
    id: '12',
    priority: 'medium',
    patientName: 'Helen Rodriguez',
    dateOfBirth: '07/08/1990',
    nhsNumber: '123 456 7901',
    callerId: '+44 7700 900134',
    duration: '5m 33s',
    timestamp: '16/03/2025 14:20',
    status: 'completed',
    summary: 'New mother concerned about breastfeeding difficulties and infant weight gain.',
    symptoms: ['Breastfeeding problems'],
    transcript: 'Patient: I\'m having trouble breastfeeding and worried about my baby\'s weight...\nAgent: How old is your baby?\nPatient: She\'s 2 weeks old...',
    agentNotes: 'Referred to community midwife for breastfeeding support. Health visitor contact arranged.'
  }
];