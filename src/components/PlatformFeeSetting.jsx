"use client";

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

const PlatformFeeSetting = () => {
  const [loading, setLoading] = useState(false);
  const [memberEntryFee, setMemberEntryFee] = useState(0);
  const [memberSubscriptionFee, setMemberSubscriptionFee] = useState(0);
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState('');

  const getCurrentPlatformFees = async () => {
    try {
      const res = await axios.get('/api/global');

      const result = res?.data;

      if (result?.status === true) {
        setMemberEntryFee(result?.global?.memberEntryFee || 0);
        setMemberSubscriptionFee(result?.global?.memberSubscriptionFee || 0);
        setFacebook(result?.global?.facebook || '');
        setInstagram(result?.global?.instagram || '');
        setTwitter(result?.global?.twitter || '');
        setAnnouncements(result?.global?.announcements || []);
      }
    } catch (error) {
      console.error('Error fetching current platform fee:', error);
    }
  };

  useEffect(() => {
    getCurrentPlatformFees();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const res = await axios.post('/api/global', {
        ...values,
        announcements: announcements
      });

      const result = res?.data;

      if (result?.status === true) {
        toast.success('Platform fee updated successfully');
      }
    } catch (error) {
      console.error('Error submitting platform fee update:', error);
      toast.error('Error submitting platform fee update');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      memberEntryFee: memberEntryFee,
      memberSubscriptionFee: memberSubscriptionFee,
      facebook: facebook,
      instagram: instagram,
      twitter: twitter,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      memberEntryFee: Yup.number().typeError('Member Entry fee must be a number').required('Member Entry fee is required'),
      memberSubscriptionFee: Yup.number().typeError('Member Subscription fee must be a number').required('Member Subscription fee is required'),
    }),
    onSubmit: handleSubmit
  });

  const addAnnouncement = () => {
    if (currentAnnouncement.trim() === '') {
      toast.error('Please enter an announcement');
      return;
    }
    
    if (announcements.includes(currentAnnouncement.trim())) {
      toast.error('This announcement already exists');
      return;
    }
    
    setAnnouncements([...announcements, currentAnnouncement.trim()]);
    setCurrentAnnouncement('');
    toast.success('Announcement added');
  };

  const removeAnnouncement = (index) => {
    const newAnnouncements = [...announcements];
    newAnnouncements.splice(index, 1);
    setAnnouncements(newAnnouncements);
    toast.success('Announcement removed');
  };


  return (
    <div className="border border-gray-300 rounded-xl p-6 bg-white">
      <div className="text-2xl font-bold mb-2">Platform Settings</div>
      <div className="text-sm text-gray-600 mb-6">Manage platform fee and social media links</div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {[
          { name: 'memberEntryFee', label: 'Member Entry Fee', placeholder: 'Enter Member Entry Fee' },
          { name: 'memberSubscriptionFee', label: 'Member Subscription Fee', placeholder: 'Enter Member Subscription Fee' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="number"
              name={field.name}
              placeholder={field.placeholder}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${formik.touched[field.name] && formik.errors[field.name]
                ? 'border-red-500'
                : 'border-gray-300'
                }`}
            />
            {formik.touched[field.name] && formik.errors[field.name] && (
              <div className="text-red-500 text-sm mt-1">{formik.errors[field.name]}</div>
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Facebook
          </label>
          <input
            type="text"
            name={'facebook'}
            placeholder={'Enter Facebook URL'}
            value={formik.values['facebook']}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent border-gray-300`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Instagram
          </label>
          <input
            type="text"
            name={'instagram'}
            placeholder={'Enter Instagram URL'}
            value={formik.values['instagram']}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent border-gray-300`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Twitter
          </label>
          <input
            type="text"
            name={'twitter'}
            placeholder={'Enter Twitter URL'}
            value={formik.values['twitter']}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent border-gray-300`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        {/* Announcements Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Announcements
          </label>
          <div className="text-xs text-gray-500 mb-3">
            Add multiple announcement texts that will be displayed on the website (one at a time, rotating)
          </div>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={currentAnnouncement}
              onChange={(e) => setCurrentAnnouncement(e.target.value)}
              placeholder="Enter announcement text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAnnouncement();
                }
              }}
            />
            <button
              type="button"
              onClick={addAnnouncement}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-150"
            >
              Add
            </button>
          </div>

          {announcements.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Announcement List
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {announcements.map((announcement, index) => (
                  <div key={index} className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 w-6 text-center">{index + 1}.</span>
                      <span className="text-gray-800">{announcement}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => removeAnnouncement(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer px-6 py-2 border border-gray-700 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Save Updates</span>
              </>
            ) : (
              "Save Updates"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlatformFeeSetting;
// "use client";

// import { useEffect, useState } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const PlatformFeeSetting = () => {
//   const [loading, setLoading] = useState(false);
//   const [memberEntryFee, setMemberEntryFee] = useState(0);
//   const [memberSubscriptionFee, setMemberSubscriptionFee] = useState(0);
//   const [facebook, setFacebook] = useState('');
//   const [instagram, setInstagram] = useState('');
//   const [twitter, setTwitter] = useState('');

//   const getCurrentPlatformFees = async () => {
//     try {
//       const res = await axios.get('/api/global');

//       const result = res?.data;

//       if (result?.status === true) {
//         setMemberEntryFee(result?.global?.memberEntryFee || 0);
//         setMemberSubscriptionFee(result?.global?.memberSubscriptionFee || 0);
//         setFacebook(result?.global?.facebook || '');
//         setInstagram(result?.global?.instagram || '');
//         setTwitter(result?.global?.twitter || '');
//       }
//     } catch (error) {
//       console.error('Error fetching current platform fee:', error);
//     }
//   };

//   useEffect(() => {
//     getCurrentPlatformFees();
//   }, []);

//   const handleSubmit = async (values) => {
//     try {
//       setLoading(true);

//       const res = await axios.post('/api/global', values);

//       const result = res?.data;

//       if (result?.status === true) {
//         toast.success('Platform fee updated successfully');
//       }
//     } catch (error) {
//       console.error('Error submitting platform fee update:', error);
//       toast.error('Error submitting platform fee update');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formik = useFormik({
//     initialValues: {
//       memberEntryFee: memberEntryFee,
//       memberSubscriptionFee: memberSubscriptionFee,
//       facebook: facebook,
//       instagram: instagram,
//       twitter: twitter,
//     },
//     enableReinitialize: true,
//     validationSchema: Yup.object({
//       memberEntryFee: Yup.number().typeError('Member Entry fee must be a number').required('Member Entry fee is required'),
//       memberSubscriptionFee: Yup.number().typeError('Member Subscription fee must be a number').required('Member Subscription fee is required'),
//     }),
//     onSubmit: handleSubmit
//   });

//   return (
//     <div className="border border-gray-300 rounded-xl p-6 bg-white">
//       <div className="text-2xl font-bold mb-2">Platform Settings</div>
//       <div className="text-sm text-gray-600 mb-6">Manage platform fee and social media links</div>

//       <form onSubmit={formik.handleSubmit} className="space-y-4">
//         {[
//           { name: 'memberEntryFee', label: 'Member Entry Fee', placeholder: 'Enter Member Entry Fee' },
//           { name: 'memberSubscriptionFee', label: 'Member Subscription Fee', placeholder: 'Enter Member Subscription Fee' },
//         ].map((field) => (
//           <div key={field.name}>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               {field.label}
//             </label>
//             <input
//               type="number"
//               name={field.name}
//               placeholder={field.placeholder}
//               value={formik.values[field.name]}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${formik.touched[field.name] && formik.errors[field.name]
//                 ? 'border-red-500'
//                 : 'border-gray-300'
//                 }`}
//             />
//             {formik.touched[field.name] && formik.errors[field.name] && (
//               <div className="text-red-500 text-sm mt-1">{formik.errors[field.name]}</div>
//             )}
//           </div>
//         ))}

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Facebook
//           </label>
//           <input
//             type="text"
//             name={'facebook'}
//             placeholder={'Enter Facebook URL'}
//             value={formik.values['facebook']}
//             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent border-gray-300`}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Instagram
//           </label>
//           <input
//             type="text"
//             name={'instagram'}
//             placeholder={'Enter Instagram URL'}
//             value={formik.values['instagram']}
//             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent border-gray-300`}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold text-gray-700 mb-2">
//             Twitter
//           </label>
//           <input
//             type="text"
//             name={'twitter'}
//             placeholder={'Enter Twitter URL'}
//             value={formik.values['twitter']}
//             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent border-gray-300`}
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//           />
//         </div>

//         <div className="mt-6">
//           <button
//             type="submit"
//             disabled={loading}
//             className="cursor-pointer px-6 py-2 border border-gray-700 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
//                 <span>Save Fee Update</span>
//               </>
//             ) : (
//               "Save Fee Update"
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PlatformFeeSetting;