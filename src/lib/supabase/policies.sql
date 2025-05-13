-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE qualifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

DROP POLICY IF EXISTS "Public languages are viewable by everyone" ON languages;
DROP POLICY IF EXISTS "Users can insert their own languages" ON languages;
DROP POLICY IF EXISTS "Users can update their own languages" ON languages;
DROP POLICY IF EXISTS "Users can delete their own languages" ON languages;

DROP POLICY IF EXISTS "Public qualifications are viewable by everyone" ON qualifications;
DROP POLICY IF EXISTS "Users can insert their own qualifications" ON qualifications;
DROP POLICY IF EXISTS "Users can update their own qualifications" ON qualifications;
DROP POLICY IF EXISTS "Users can delete their own qualifications" ON qualifications;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Profiles table policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Languages table policies
CREATE POLICY "Public languages are viewable by everyone"
ON languages FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own languages"
ON languages FOR INSERT
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own languages"
ON languages FOR UPDATE
USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own languages"
ON languages FOR DELETE
USING (auth.uid() = profile_id);

-- Qualifications table policies
CREATE POLICY "Public qualifications are viewable by everyone"
ON qualifications FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own qualifications"
ON qualifications FOR INSERT
WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own qualifications"
ON qualifications FOR UPDATE
USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own qualifications"
ON qualifications FOR DELETE
USING (auth.uid() = profile_id);

-- Storage bucket policies
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'documents'
);

CREATE POLICY "Public can view documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
USING (
  auth.uid() = owner AND
  bucket_id = 'documents'
);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  auth.uid() = owner AND
  bucket_id = 'documents'
);

-- Create stored procedure for doctor profile creation
CREATE OR REPLACE FUNCTION create_doctor_profile(
  p_profile_id UUID,
  p_full_name TEXT,
  p_avatar_url TEXT,
  p_role TEXT,
  p_date_of_birth DATE,
  p_gender TEXT,
  p_specialization TEXT,
  p_license_number TEXT,
  p_years_of_experience INTEGER,
  p_phone_number TEXT,
  p_address TEXT,
  p_bio TEXT,
  p_profile_picture TEXT,
  p_identity_proof TEXT,
  p_medical_license TEXT,
  p_additional_documents TEXT[],
  p_languages TEXT[],
  p_qualifications JSONB[]
) RETURNS void AS $$
BEGIN
  -- Start transaction
  BEGIN
    -- Insert profile
    INSERT INTO profiles (
      id,
      full_name,
      avatar_url,
      role,
      date_of_birth,
      gender,
      specialization,
      license_number,
      years_of_experience,
      phone_number,
      address,
      bio,
      profile_picture,
      identity_proof,
      medical_license,
      additional_documents
    ) VALUES (
      p_profile_id,
      p_full_name,
      p_avatar_url,
      p_role,
      p_date_of_birth,
      p_gender,
      p_specialization,
      p_license_number,
      p_years_of_experience,
      p_phone_number,
      p_address,
      p_bio,
      p_profile_picture,
      p_identity_proof,
      p_medical_license,
      p_additional_documents
    );

    -- Insert languages
    IF p_languages IS NOT NULL THEN
      INSERT INTO languages (profile_id, language)
      SELECT p_profile_id, unnest(p_languages);
    END IF;

    -- Insert qualifications
    IF p_qualifications IS NOT NULL THEN
      INSERT INTO qualifications (profile_id, Degree, Institution, Year)
      SELECT 
        p_profile_id,
        (qual->>'degree')::TEXT,
        (qual->>'institution')::TEXT,
        (qual->>'year')::NUMERIC
      FROM unnest(p_qualifications) AS qual;
    END IF;

  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Failed to create doctor profile: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 