import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

interface Cabin {
  id?: number;
  name: string;
  description: string;
  image: File | string;
  [key: string]: any;
}

interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export async function createEditCabin(
  newCabin: Cabin,
  id?: number
): Promise<Cabin> {
  const hasImagePath = (newCabin.image as string)?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${
    (newCabin.image as File).name
  }`.replaceAll("/", "");
  const imagePath = hasImagePath
    ? (newCabin.image as string)
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  let query;

  // A) CREATE
  if (!id) {
    query = supabase.from("cabins").insert([{ ...newCabin, image: imagePath }]);
  } else {
    // B) EDIT
    query = supabase
      .from("cabins")
      .update({ ...newCabin, image: imagePath })
      .eq("id", id);
  }

  const { data, error }: SupabaseResponse<Cabin> = await query
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Upload image
  if (hasImagePath) return data as Cabin;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image as File);

  // 3. Delete the cabin IF there was an error uploading image
  if (storageError) {
    await supabase
      .from("cabins")
      .delete()
      .eq("id", (data as Cabin).id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  return data as Cabin;
}

interface DeleteCabinResponse {
  data: any;
  error: Error | null;
}

export async function deleteCabin(id: number): Promise<any> {
  const { data, error }: DeleteCabinResponse = await supabase
    .from("cabins")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
