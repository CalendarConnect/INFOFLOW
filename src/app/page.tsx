import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect directly to editor
  redirect('/editor');
}
