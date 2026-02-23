// app/posts/[id]/PostDetailClient.js (Rename your existing file)
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  PhotoIcon,
  VideoCameraIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaTelegram,
  FaLinkedin
} from 'react-icons/fa';

export default function PostDetailClient({ initialPost }) {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMedia, setSelectedMedia] = useState({ type: 'image', index: 0 });
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrls, setShareUrls] = useState({});

  // Update share URLs when post changes
  useEffect(() => {
    if (!post) return;

    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      const shareText = `${post.title} - ${post.description ? post.description.substring(0, 100) : 'Check out this post'}`;

      setShareUrls({
        whatsapp: `https://wa.me/?text=${encodeURIComponent(currentUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
      });
    }
  }, [post]);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/post/get-post?id=${params?.id}`);
      
      if (response.data.status === true) {
        setPost(response?.data?.post);
        
        // Update OG tags dynamically for clients that don't read server meta
        if (typeof window !== 'undefined' && response.data.post) {
          const postData = response.data.post;
          const metaTags = [
            { property: 'og:title', content: postData.title },
            { property: 'og:description', content: postData.description || 'Check out this post' },
            { property: 'og:image', content: postData.images?.[0] || '/default-og.jpg' },
            { property: 'og:url', content: window.location.href },
            { name: 'twitter:title', content: postData.title },
            { name: 'twitter:description', content: postData.description || 'Check out this post' },
            { name: 'twitter:image', content: postData.images?.[0] || '/default-og.jpg' },
          ];
          
          metaTags.forEach(tag => {
            const selector = tag.property 
              ? `meta[property="${tag.property}"]`
              : `meta[name="${tag.name}"]`;
            
            let meta = document.querySelector(selector);
            if (meta) {
              meta.setAttribute('content', tag.content);
            }
          });
        }
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  // Optional: Fetch fresh data on component mount
  useEffect(() => {
    if (params.id) {
      // You can enable this if you want fresh data on every client visit
      // fetchPost();
    }
  }, [params.id, fetchPost]);

  // Get all media items (images + video)
  const getAllMedia = useCallback(() => {
    if (!post) return [];
    
    const media = [];

    // Add video if exists
    if (post?.video) {
      media.push({ type: 'video', url: post.video, thumbnail: post.images?.[0] });
    }

    // Add all images
    if (post?.images?.length > 0) {
      post.images.forEach((image, index) => {
        media.push({ type: 'image', url: image, index });
      });
    }

    return media;
  }, [post]);

  const handleMediaClick = (mediaType, index = 0) => {
    setSelectedMedia({ type: mediaType, index });
    setMediaViewerOpen(true);
  };

  const handleThumbnailClick = (mediaType, index = 0) => {
    setSelectedMedia({ type: mediaType, index });
  };

  const navigateMedia = useCallback((direction) => {
    const media = getAllMedia();
    const currentIndex = media.findIndex(item =>
      item.type === selectedMedia.type &&
      (item.type === 'video' || item.index === selectedMedia.index)
    );

    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % media.length;
      setSelectedMedia({ type: media[nextIndex].type, index: media[nextIndex].index || 0 });
    } else {
      const prevIndex = (currentIndex - 1 + media.length) % media.length;
      setSelectedMedia({ type: media[prevIndex].type, index: media[prevIndex].index || 0 });
    }
  }, [getAllMedia, selectedMedia]);

  const handleShare = (platform) => {
    if (!shareUrls[platform]) return;
    
    // Update OG tags just before sharing to ensure WhatsApp sees them
    if (platform === 'whatsapp' && typeof window !== 'undefined') {
      // Force meta tag updates
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', post.title);
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', post.images?.[0] || '/default-og.jpg');
    }
    
    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/')}
            className="cursor-pointer bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const media = getAllMedia();
  const hasMultipleMedia = media.length > 1;

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <div className="md:flex items-center justify-between py-4 px-4 sm:px-6 lg:px-15">
        <button
          onClick={() => router.back()}
          className="flex border border-green-200 rounded-lg px-4 py-2 items-center cursor-pointer bg-white text-gray-600 hover:text-gray-900 transition duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="flex flex-wrap gap-2 mt-4 md:gap-3 md:mt-0">
          {/* WhatsApp */}
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200"
            aria-label="Share on WhatsApp"
          >
            <FaWhatsapp className="w-5 h-5 text-green-600" />
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleShare('facebook')}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            aria-label="Share on Facebook"
          >
            <FaFacebook className="w-5 h-5 text-blue-600" />
          </button>

          {/* Twitter */}
          <button
            onClick={() => handleShare('twitter')}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-sky-200 rounded-lg hover:bg-sky-50 hover:border-sky-300 transition-all duration-200"
            aria-label="Share on Twitter"
          >
            <FaTwitter className="w-5 h-5 text-sky-500" />
          </button>

          {/* Telegram */}
          <button
            onClick={() => handleShare('telegram')}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            aria-label="Share on Telegram"
          >
            <FaTelegram className="w-5 h-5 text-blue-500" />
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleShare('linkedin')}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
            aria-label="Share on LinkedIn"
          >
            <FaLinkedin className="w-5 h-5 text-blue-700" />
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
            aria-label={copied ? "Link copied" : "Copy link"}
          >
            {copied ? (
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-green-600" />
            ) : (
              <ClipboardDocumentIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Post Header */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-6">
          {post.team && (
            <div className="mb-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-500 text-white shadow-lg border border-green-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                {post.team?.name}
              </span>
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{post?.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {dayjs(post?.caseDate).format('DD MMMM YYYY')}
            </div>
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              {post.city}, {post.state}
            </div>
            <div className="flex items-center">
              <PhotoIcon className="w-4 h-4 mr-1" />
              {post.images?.length || 0} photos
            </div>
            {post.video && (
              <div className="flex items-center">
                <VideoCameraIcon className="w-4 h-4 mr-1" />
                1 video
              </div>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {post.description}
          </p>
        </div>

        {/* Media Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden mb-6">
          {/* Main Media Display */}
          <div className="relative bg-black">
            {selectedMedia.type === 'video' ? (
              <div className="aspect-w-16 aspect-h-9">
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-contain max-h-96"
                  src={post.video}
                  poster={post.images?.[0]}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <img
                src={post.images?.[selectedMedia.index]}
                alt={post.title}
                className="w-full h-auto max-h-96 object-contain cursor-pointer"
                onClick={() => handleMediaClick('image', selectedMedia.index)}
              />
            )}
          </div>

          {(post?.video || post?.images?.length > 0) && (
            <div className="p-4 border-t border-green-200">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {post?.video && (
                  <button
                    onClick={() => handleThumbnailClick('video')}
                    className={`cursor-pointer aspect-square rounded-lg overflow-hidden border-2 transition duration-300 ${selectedMedia.type === 'video' ? 'border-green-500' : 'border-gray-300'
                      }`}
                    aria-label="View video"
                  >
                    <div className="w-full h-full bg-gray-800 relative">
                      <img
                        src={post?.images?.[0] || '/placeholder-image.jpg'}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                {post?.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick('image', index)}
                    className={`cursor-pointer aspect-square rounded-lg overflow-hidden border-2 transition duration-300 ${selectedMedia.type === 'image' && selectedMedia.index === index ? 'border-green-300' : 'border-gray-300'
                      }`}
                    aria-label={`View photo ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${post.title} - Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Location Details */}
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-green-600" />
              Location Details
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">City:</span>
                <span className="ml-2 text-gray-600">{post.city || 'Not specified'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">State:</span>
                <span className="ml-2 text-gray-600">{post.state || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Post Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-green-600" />
              Post Information
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Activity Date:</span>
                <span className="ml-2 text-gray-600">
                  {dayjs(post.caseDate).format('DD MMMM YYYY')}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Media Count:</span>
                <span className="ml-2 text-gray-600">
                  {post.images?.length || 0} photos
                  {post.video && ' + 1 video'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Viewer Modal */}
      {mediaViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full w-full">
            <button
              onClick={() => setMediaViewerOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
              aria-label="Close media viewer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Arrows */}
            {hasMultipleMedia && (
              <>
                <button
                  onClick={() => navigateMedia('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3"
                  aria-label="Previous media"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => navigateMedia('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3"
                  aria-label="Next media"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Media Display */}
            <div className="flex items-center justify-center p-4 h-full">
              {selectedMedia.type === 'video' ? (
                <div className="w-full max-w-4xl">
                  <video
                    controls
                    autoPlay
                    className="w-full h-auto max-h-screen rounded-lg"
                    src={post.video}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <img
                  src={post.images?.[selectedMedia.index]}
                  alt={post.title}
                  className="max-w-full max-h-screen object-contain rounded-lg"
                />
              )}
            </div>

            {/* Media Counter */}
            {hasMultipleMedia && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {media.findIndex(item =>
                  item.type === selectedMedia.type &&
                  (item.type === 'video' || item.index === selectedMedia.index)
                ) + 1} / {media.length}
              </div>
            )}

            {/* Media Type Indicator */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {selectedMedia.type === 'video' ? 'VIDEO' : `PHOTO ${selectedMedia.index + 1}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}