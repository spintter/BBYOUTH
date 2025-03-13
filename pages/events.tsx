import Head from 'next/head';

export default function Events() {
  return (
    <>
      <Head>
        <title>Events - BBYM</title>
        <meta
          name="description"
          content="Upcoming events and programs from Birmingham-Bessemer Youth Ministries."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Events - Coming Soon</h1>
      </div>
    </>
  );
}
