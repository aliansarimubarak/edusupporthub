const FAQPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-sm text-slate-700">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">FAQ</h1>

      <div className="space-y-4">
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">
            Is EduSupportHub free to join?
          </h2>
          <p>Yes, students and experts can create accounts for free.</p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">
            How do payments work?
          </h2>
          <p>
            Students pay through our secure payment provider. Funds are released
            to experts when the work is completed and approved.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">
            Is this plagiarism or cheating?
          </h2>
          <p>
            Work delivered via EduSupportHub is for learning and reference
            purposes only. We encourage students to use it ethically and follow
            their institution&apos;s policies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
