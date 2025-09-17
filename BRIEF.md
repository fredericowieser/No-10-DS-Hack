# Improving access to primary care

The UK government has committed to improving access to primary care – a key part of this is ensuring that patients can get a timely appointment with an appropriate member of primary care staff. They are also committed to bringing back the family doctor, which means ensuring that patients with a preferred healthcare professional are able to get an appointment with them. 
 
Non-GP staff (which includes nurses and other healthcare professionals) are being increasingly utilised to scale up the number of appointments that can be made available. In many cases, these staff can provide the support that patients need without them seeing a GP. However, patients with complex underlying health conditions typically benefit from seeing a GP, and some patients are more likely to report overall satisfaction with primary care if they see a GP. 
 
One area we would like support with is helping decide which patients on a GP practice's list would benefit the most clinically and derive satisfaction from an appointment with particular staff types. This could include helping us triage patients given existing preferences, complexity of request, vulnerability, and clinical need. 
 
But more broadly, we want you to help us reimagine how primary care can better match patients with the right professional at the right time—balancing clinical need, personal preference, and system efficiency.
 
## Potential Datasets: 
Synthetic data for a cohort of patients, including information on pre-existing health conditions, historic preferences, demographics and description of request.
ONS health insights survey, which measures overall satisfaction with primary care provider and whether a patient has a preferred GP, broken down by demographic factors.
Data on numbers of appointments available, split by staff type

# Help us triage the patients

Raw Data
ONS Health Insights SurveyONS health insights survey, which measures overall satisfaction with primary care provider and whether a patient has a preferred GP, broken down by demographic factors.
Synthetic Datadata representing patients, associated co-morbidities, various types of GP clinic types


## Ontology Objects

Patientpatients information including demographics
Co-morbiditiesinformation around co-morbidities associated with patients
GP RequestA Request for a GP appointment
GP RegistrationWhere the individual is registeredHint this might allow you to derive population statistics associated with the local area to improve the triage

GP AppointmentHistory of previous appointments with the GP. Does the individual cancel their appointments a lot? 
GP ClinicsHistorical and upcoming clinics of various types 
Care ProfessionalCare professionals


## Starter Ideas
Use the ONS data to investigate the effect of location and demographics on responsesDecide on a methodology for triaging patients to various clinic typesCreate a user-facing tool to allow them to decide on which patients to triage into which appointmentsHINT the GP Request objects comes with an associated free-text request. Can you extract key details from this Free-text to create a recommendation for the user in their workflow



## Stretch
Could you pre-triage via a chat interface to ensure that the patient has an optimal placement?Other than the two clinics identified are there other services you could be directing users to?Can you identify local Pharmacies near to the GP's?https://www.odsdatasearchandexport.nhs.uk/
If someone needs a simple test - could this be performed at community diagnostic centre?
Create a methodology to adjust the ratios of Face to Face to Virtual Clinics based on local population needs?