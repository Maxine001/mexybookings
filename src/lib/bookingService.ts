import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BookingData {
  packageId: string;
  packageName: string;
  packagePrice: number;
  packageDuration: string;
  sessionDate: Date;
  sessionTime: string;
  clientName: string;
  specialRequests?: string;
  uploadedFiles: File[];
}

export const bookingService = {
  async createBooking(bookingData: BookingData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First, create the booking record
      const { data: booking, error: bookingError } = await (supabase
        .from('profiles') as any)
        .insert({
          user_id: user.id,
          package_id: bookingData.packageId,
          package_name: bookingData.packageName,
          package_price: bookingData.packagePrice,
          package_duration: bookingData.packageDuration,
          session_date: bookingData.sessionDate.toISOString().split('T')[0],
          session_time: bookingData.sessionTime,
          client_name: bookingData.clientName,
          special_requests: bookingData.specialRequests || null,
        })
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      // Upload images if any
      const uploadedImages = [];
      if (bookingData.uploadedFiles && bookingData.uploadedFiles.length > 0) {
        for (const file of bookingData.uploadedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${booking.id}/${Date.now()}.${fileExt}`;
          
          // Upload file to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('booking-images')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue; // Continue with other files if one fails
          }

          // Save image record to database
          const { data: imageRecord, error: imageError } = await (supabase
            .from('profiles') as any)
            .insert({
              booking_id: booking.id,
              file_name: file.name,
              file_path: uploadData.path,
              file_size: file.size,
              mime_type: file.type,
            })
            .select()
            .single();

          if (!imageError) {
            uploadedImages.push(imageRecord);
          }
        }
      }

      return {
        booking,
        uploadedImages,
        success: true,
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  async getUserBookings() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          booking_images (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  async getBookingById(bookingId: string) {
    try {
      const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
          *,
          booking_images (*)
        `)
        .eq('id', bookingId)
        .single();

      if (error) {
        throw error;
      }

      return booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  async getImageUrl(filePath: string) {
    try {
      const { data } = await supabase.storage
        .from('booking-images')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  }
};
