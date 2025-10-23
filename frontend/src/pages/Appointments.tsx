export default function Appointments() {
  return (
    <div className="container px-4 py-24 mx-auto">
      <h1 className="mb-4 text-4xl font-bold font-heading text-accent">Book an Appointment</h1>
      <p className="text-lg text-dark font-body">Appointment booking coming soon!</p>
      <div className="mt-8">
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 text-white transition rounded-md shadow bg-accent hover:opacity-90"
          onClick={() => (window.location.href = '/appointments/all')}
          aria-label="View all appointments"
        >
          View All Appointments
        </button>
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 text-white transition rounded-md shadow bg-accent hover:opacity-90"
          onClick={() => (window.location.href = '/appointments/new')}
          aria-label="Book a new appointment"
        >
          Book a New Appointment
        </button>
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 text-white transition rounded-md shadow bg-accent hover:opacity-90"
          onClick={() => (window.location.href = '/appointments/my')}
          aria-label="View my appointments"
        >
          View My Appointments
        </button>
      </div>
    </div>
  );
}
