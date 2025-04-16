// Define types for the topics
export interface Topic {
  id: number;
  title: string;
  link: string;
  description: string;
}

// Define chess piece icons for each topic
export const chessPieceIcons: Record<string, string> = {
  religion: '♖', // Rook - represents Church structures
  music: '♘', // Knight - represents movement and creativity
  'theatre-arts': '♕', // Queen - represents drama and performance
  stem: '♙', // Pawn - represents progress and innovation
  'law-politics': '♔', // King - represents authority and governance
  philosophy: '♗', // Bishop - represents wisdom and thought
  dance: '♘', // Knight - represents movement and creativity
  history: '♖', // Rook - represents strong foundations
  economics: '♙', // Pawn - represents growth and economic mobility
  'digital-humanities': '♗', // Bishop - represents strategic connections
  literature: '♕', // Queen - represents powerful storytelling
  art: '♔', // King - represents cultural significance
};

// Define the humanities topics with rich content
export const topics: Topic[] = [
  {
    id: 1,
    title: 'Religion',
    link: '/topics/religion',
    description:
      "Explore the role of religion in African American communities, focusing on Birmingham's historic Black churches.",
  },
  {
    id: 2,
    title: 'Music',
    link: '/topics/music',
    description:
      'Celebrate the rich musical heritage of African Americans, from gospel to jazz to hip-hop.',
  },
  {
    id: 3,
    title: 'Theatre Arts',
    link: '/topics/theatre-arts',
    description:
      'Examine the role of theatre in African American storytelling and cultural expression.',
  },
  {
    id: 4,
    title: 'STEM',
    link: '/topics/stem',
    description:
      'Explore African American contributions to science, technology, engineering, and mathematics.',
  },
  {
    id: 5,
    title: 'Law & Politics',
    link: '/topics/law-politics',
    description:
      'Examine the role of African Americans in shaping law and politics, with focus on civil rights.',
  },
  {
    id: 6,
    title: 'Philosophy',
    link: '/topics/philosophy',
    description:
      'Engage with philosophical questions through African American perspectives, fostering critical thinking.',
  },
  {
    id: 7,
    title: 'Dance',
    link: '/topics/dance',
    description: 'Celebrate African American dance traditions and their cultural significance.',
  },
  {
    id: 8,
    title: 'History',
    link: '/topics/history',
    description:
      "Dive into African American history, focusing on Birmingham's role in the Civil Rights Movement.",
  },
  {
    id: 9,
    title: 'Economics',
    link: '/topics/economics',
    description:
      'Examine economic contributions and challenges faced by African Americans in Birmingham and beyond.',
  },
  {
    id: 10,
    title: 'Digital Humanities',
    link: '/topics/digital-humanities',
    description:
      'Harness digital tools to explore and preserve African American humanities and culture.',
  },
  {
    id: 11,
    title: 'Literature',
    link: '/topics/literature',
    description:
      "Dive into African American literature, celebrating Birmingham's literary contributions.",
  },
  {
    id: 12,
    title: 'Art',
    link: '/topics/art',
    description: 'Discover the impact of African American art on cultural expression and identity.',
  },
];

// Define the detailed content for each topic
export const topicsContent = {
  religion: {
    title: 'Religion',
    description:
      "Explore the role of religion in African American communities, focusing on Birmingham's historic Black churches and their cultural impact.",
    image: '/images/16th_Street_Baptist_Church_whiteanblack.jpg',
    introduction:
      'Religion has been a cornerstone of African American life, providing spiritual sustenance and a platform for social change, particularly in Birmingham. The Black church, exemplified by institutions like the 16th Street Baptist Church, has been a center for community organizing, cultural expression, and resistance against oppression. From gospel music to sermons that inspired the Civil Rights Movement, religion shapes African American identity and resilience. For Black youth, understanding this legacy offers a lens to explore faith, ethics, and community leadership, empowering them to contribute to the humanities through a spiritual and cultural perspective.',
    subtopics: [
      {
        title: 'The Black Church in Birmingham',
        description:
          "Learn about the 16th Street Baptist Church's role in the Civil Rights Movement, including its tragic bombing in 1963, and how it remains a symbol of faith and activism in Birmingham.",
      },
      {
        title: 'Gospel Music and Worship',
        description:
          "Explore the influence of gospel music in African American worship, a tradition that blends spirituality with cultural expression, shaping Birmingham's religious and musical heritage.",
      },
      {
        title: 'Religion and Social Justice',
        description:
          'Examine how Black religious leaders in Birmingham, like Rev. Fred Shuttlesworth, used faith to advocate for justice, inspiring movements for equality and community empowerment.',
      },
    ],
    furtherExploration: [
      {
        title: 'Birmingham Civil Rights Institute',
        link: 'https://www.bcri.org',
        description: 'Explore the role of Black churches in civil rights.',
      },
      {
        title: 'Smithsonian: African American Religion',
        link: 'https://nmaahc.si.edu/explore/exhibitions/religion',
        description: 'Learn about African American religious traditions.',
      },
      {
        title: 'PBS: The Black Church',
        link: 'https://www.pbs.org/show/black-church',
        description: "Watch a documentary on the Black church's history.",
      },
    ],
    discussion:
      "Religion offers Black youth a framework to explore their spiritual and cultural heritage, yet the role of women in Black religious leadership is often underrepresented. This topic encourages youth to critically examine how faith intersects with activism, fostering a deeper understanding of their community's resilience and contributions to the humanities.",
  },
  music: {
    title: 'Music',
    description:
      "Celebrate the rich musical heritage of African Americans, with a focus on Birmingham's contributions to gospel, jazz, and hip-hop.",
    image: '/images/church3_optimized.webp',
    introduction:
      'Music is a vital expression of African American culture, with Birmingham playing a significant role in genres like gospel, jazz, and hip-hop. From the spirituals sung in churches to the jazz innovations of Sun Ra, a Birmingham native, music has been a tool for storytelling, resistance, and celebration. This topic explores how these musical traditions have shaped African American identity and influenced global culture. For Black youth, engaging with this heritage offers a creative outlet to explore their history and contribute to the humanities through musical expression.',
    subtopics: [
      {
        title: 'Gospel Music in Birmingham',
        description:
          "Discover the roots of gospel music in Birmingham's Black churches, where choirs and spirituals have long been a source of hope and community bonding, influencing national gospel traditions.",
      },
      {
        title: 'Sun Ra and Jazz Innovation',
        description:
          'Learn about Sun Ra, a Birmingham-born jazz pioneer whose avant-garde music blended African rhythms with cosmic themes, leaving a lasting impact on jazz and Afrofuturism.',
      },
      {
        title: 'Hip-Hop and Modern Expression',
        description:
          "Explore how Birmingham's youth use hip-hop to address contemporary issues like systemic racism and economic disparity, continuing the tradition of music as a form of resistance.",
      },
    ],
    furtherExploration: [
      {
        title: 'Smithsonian Jazz Archives',
        link: 'https://americanhistory.si.edu/smithsonian-jazz',
        description: 'Explore African American jazz history.',
      },
      {
        title: 'National Museum of Gospel Music',
        link: 'https://www.nationalmuseumofgospelmusic.org',
        description: "Learn about gospel music's impact.",
      },
      {
        title: 'NPR: Sun Ra Biography',
        link: 'https://www.npr.org/artists/sun-ra',
        description: "Read about Sun Ra's contributions to jazz.",
      },
    ],
    discussion:
      'Music connects Black youth to their cultural roots, but local Birmingham artists often lack mainstream recognition. This topic highlights their contributions, encouraging youth to critically engage with music as a medium for storytelling and activism, thus enriching the humanities with their creative voices.',
  },
  'theatre-arts': {
    title: 'Theatre Arts',
    description:
      "Examine the role of theatre in African American storytelling, focusing on Birmingham's local theatre scene and its cultural significance.",
    image: '/images/urban_youth_relaxing.webp',
    introduction:
      'Theatre Arts have long been a powerful medium for African American storytelling, offering a stage to explore identity, history, and social issues. In Birmingham, local theatre groups like the Red Mountain Theatre Company have produced works that highlight Black experiences, from historical dramas to contemporary plays. This topic explores how theatre serves as a tool for cultural expression and community engagement, empowering Black youth to share their stories and contribute to the humanities through performance and dramatic arts.',
    subtopics: [
      {
        title: "Birmingham's Black Theatre Scene",
        description:
          'Discover local theatre groups in Birmingham, such as the Red Mountain Theatre, which produce plays that address African American history and contemporary issues, fostering community dialogue.',
      },
      {
        title: 'Playwrights and Performers',
        description:
          "Learn about influential African American playwrights like August Wilson, whose works explore Black life, and how their legacy inspires Birmingham's theatre artists to create meaningful performances.",
      },
      {
        title: 'Theatre as Activism',
        description:
          'Explore how theatre has been used as a form of activism in African American communities, with Birmingham productions addressing themes like racial justice and cultural pride.',
      },
    ],
    furtherExploration: [
      {
        title: 'Red Mountain Theatre Company',
        link: 'https://redmountaintheatre.org',
        description: "Explore Birmingham's theatre productions.",
      },
      {
        title: 'National Black Theatre',
        link: 'https://www.nationalblacktheatre.org',
        description: 'Learn about African American theatre history.',
      },
      {
        title: 'PBS: Theatre and Civil Rights',
        link: 'https://www.pbs.org/wnet/americanmasters/theatre-civil-rights',
        description: 'Watch a documentary on theatre and activism.',
      },
    ],
    discussion:
      'Theatre Arts provide Black youth with a platform to express their narratives, yet access to theatre education in Birmingham can be limited. This topic encourages youth to critically engage with theatre as a tool for activism and storytelling, fostering their contributions to the humanities through performance.',
  },
  stem: {
    title: 'STEM (Science, Technology, Engineering, and Mathematics)',
    description:
      "Explore the contributions of African Americans to STEM fields, highlighting Birmingham's role in fostering Black innovation.",
    image: '/images/ai_humanities_compressed.webp',
    introduction:
      'STEM (Science, Technology, Engineering, and Mathematics) has been significantly shaped by African American innovators, despite systemic barriers. In Birmingham, initiatives like the Alabama STEM Council work to engage Black youth in these fields, building on the legacy of pioneers like Katherine Johnson. This topic examines how STEM intersects with African American humanities by addressing issues like technological access, representation, and innovation. For Black youth, engaging with STEM offers opportunities to contribute to the humanities through interdisciplinary approaches, such as using technology to preserve cultural history.',
    subtopics: [
      {
        title: 'African American STEM Pioneers',
        description:
          "Learn about pioneers like Katherine Johnson, whose calculations were crucial for NASA, and how their achievements inspire Birmingham's Black youth to pursue STEM careers.",
      },
      {
        title: 'STEM Education in Birmingham',
        description:
          'Explore local STEM programs, such as those offered by the Alabama STEM Council, which provide Black youth with hands-on learning opportunities in science and technology.',
      },
      {
        title: 'STEM and Cultural Preservation',
        description:
          "Discover how STEM can be used to preserve African American culture, such as through digital archiving projects that document Birmingham's historical artifacts and oral histories.",
      },
    ],
    furtherExploration: [
      {
        title: 'National Society of Black Engineers',
        link: 'https://www.nsbe.org',
        description: 'Access resources for Black STEM professionals.',
      },
      {
        title: 'Smithsonian: STEM Innovators',
        link: 'https://www.si.edu/spotlight/stem-innovators',
        description: 'Learn about African American STEM pioneers.',
      },
      {
        title: 'NASA: Katherine Johnson',
        link: 'https://www.nasa.gov/content/katherine-johnson-biography',
        description: "Read about Katherine Johnson's contributions.",
      },
    ],
    discussion:
      'STEM offers Black youth a pathway to innovation, but underrepresentation in these fields remains a challenge. This topic highlights their contributions, encouraging youth to critically explore how STEM can intersect with humanities to address cultural and social issues, thus broadening their impact.',
  },
  'law-politics': {
    title: 'Law & Politics',
    description:
      "Examine the role of African Americans in shaping law and politics, with a focus on Birmingham's civil rights legal battles.",
    image: '/images/mlk_hitstory.jpeg',
    introduction:
      'Law & Politics have been critical arenas for African American advancement, particularly in Birmingham, a key battleground for civil rights legislation. From the legal strategies of Thurgood Marshall to the activism of local leaders like Angela Davis, this topic explores how Black communities have influenced legal and political systems. For Black youth, understanding this history provides tools to advocate for justice and engage in civic leadership, contributing to the humanities through informed activism and policy analysis.',
    subtopics: [
      {
        title: 'Civil Rights Legal Battles',
        description:
          "Learn about Birmingham's role in landmark legal cases, such as the 1963 desegregation efforts, and how lawyers like Thurgood Marshall fought for justice in the courts.",
      },
      {
        title: 'Angela Davis and Political Activism',
        description:
          'Explore the legacy of Angela Davis, a Birmingham native, whose political activism and scholarship on systemic racism continue to inspire youth to engage in political discourse.',
      },
      {
        title: 'Youth Civic Engagement',
        description:
          'Discover programs in Birmingham that teach youth about law and politics, such as mock trials and voter registration drives, empowering them to influence policy and advocate for change.',
      },
    ],
    furtherExploration: [
      {
        title: 'Equal Justice Initiative',
        link: 'https://eji.org',
        description: 'Learn about legal efforts for racial justice.',
      },
      {
        title: 'NAACP Legal Defense Fund',
        link: 'https://www.naacpldf.org',
        description: 'Explore legal advocacy for civil rights.',
      },
      {
        title: 'PBS: Angela Davis Documentary',
        link: 'https://www.pbs.org/independentlens/films/free-angela',
        description: 'Watch a documentary on Angela Davis.',
      },
    ],
    discussion:
      'Law & Politics empower Black youth to advocate for systemic change, but the complexity of legal systems can be a barrier. This topic provides historical context and practical tools, encouraging youth to critically engage with policy and contribute to the humanities through informed activism.',
  },
  philosophy: {
    title: 'Philosophy',
    description:
      "Engage with philosophical questions through African American perspectives, fostering critical thinking among Birmingham's Black youth.",
    image: '/images/young_group.jpg',
    introduction:
      'Philosophy through an African American lens offers profound insights into identity, justice, and community, with Birmingham natives like Angela Davis contributing to this discourse. This topic explores thinkers like W.E.B. Du Bois, whose concept of double consciousness addresses the Black experience, and encourages youth to grapple with ethical and existential questions. For Black youth, engaging with philosophy fosters critical thinking and ethical reasoning, enabling them to contribute to the humanities by addressing contemporary challenges with cultural and philosophical depth.',
    subtopics: [
      {
        title: 'W.E.B. Du Bois and Double Consciousness',
        description:
          "Explore Du Bois's concept of double consciousness, which describes the African American experience of navigating dual identities, and its relevance to Birmingham's youth today.",
      },
      {
        title: "Angela Davis's Philosophical Contributions",
        description:
          'Learn about Angela Davis, a Birmingham native, whose work on systemic racism and justice offers a philosophical framework for understanding and addressing social inequities.',
      },
      {
        title: 'Youth Philosophy Discussions',
        description:
          "Join BBYM's philosophy forums, where youth discuss topics like morality, freedom, and identity, fostering critical thinking within a supportive community setting.",
      },
    ],
    furtherExploration: [
      {
        title: 'Stanford Encyclopedia of Philosophy: Africana Philosophy',
        link: 'https://plato.stanford.edu/entries/africana',
        description: 'Read about Africana philosophy.',
      },
      {
        title: 'Philosophy Learning and Teaching Organization',
        link: 'https://www.plato-philosophy.org',
        description: 'Access resources for teaching philosophy.',
      },
      {
        title: 'TED-Ed: Philosophy Lessons',
        link: 'https://ed.ted.com/lessons?category=philosophy',
        description: 'Watch videos on philosophical concepts.',
      },
    ],
    discussion:
      'Philosophy encourages Black youth to address complex moral questions, yet African American perspectives are often sidelined in mainstream philosophy. This topic bridges that gap, prompting youth to critically analyze ethical issues through their cultural lens, thus enriching humanities discourse with diverse viewpoints.',
  },
  dance: {
    title: 'Dance',
    description:
      "Celebrate African American dance traditions, exploring their cultural significance and Birmingham's local dance scene.",
    image: '/images/youth_group.webp',
    introduction:
      'Dance is a powerful expression of African American culture, rooted in African traditions and evolving through history to include forms like tap, hip-hop, and liturgical dance. In Birmingham, dance groups like the Alabama Dance Council celebrate this heritage, blending traditional and contemporary styles. This topic explores how dance serves as a medium for storytelling, resistance, and community bonding, empowering Black youth to connect with their roots and contribute to the humanities through movement and performance.',
    subtopics: [
      {
        title: 'African Roots of Black Dance',
        description:
          'Learn about the African origins of Black dance, such as the ring shout, and how these traditions have influenced modern forms like tap and hip-hop in African American communities.',
      },
      {
        title: "Birmingham's Dance Community",
        description:
          'Discover local dance groups in Birmingham, such as those supported by the Alabama Dance Council, which offer performances and workshops celebrating African American dance heritage.',
      },
      {
        title: 'Dance as Cultural Expression',
        description:
          'Explore how dance has been used to express cultural identity and resistance, from spiritual dances in churches to hip-hop performances addressing social issues in Birmingham.',
      },
    ],
    furtherExploration: [
      {
        title: 'Alvin Ailey American Dance Theater',
        link: 'https://www.alvinailey.org',
        description: 'Learn about African American dance traditions.',
      },
      {
        title: 'Alabama Dance Council',
        link: 'https://alabamadancecouncil.org',
        description: "Explore Birmingham's dance community.",
      },
      {
        title: 'Smithsonian: African Dance',
        link: 'https://folklife.si.edu/african-dance',
        description: 'Discover the history of African dance.',
      },
    ],
    discussion:
      'Dance connects Black youth to their cultural heritage, but access to dance education in Birmingham can be limited. This topic highlights local resources, encouraging youth to critically engage with dance as a form of expression and resistance, thus contributing to the humanities through movement.',
  },
  history: {
    title: 'History',
    description:
      "Dive into African American history, focusing on Birmingham's pivotal role in the Civil Rights Movement and cultural heritage.",
    image: '/images/soldier_history.jpg',
    introduction:
      "History explores the African American experience, with Birmingham as a focal point for civil rights activism and cultural heritage. From the 1963 bombing of the 16th Street Baptist Church to the city's role in desegregation, this topic uncovers the struggles and triumphs that define Black history. For Black youth, understanding this history fosters pride and purpose, empowering them to contribute to the humanities by preserving and sharing these narratives, ensuring they remain a vital part of cultural discourse.",
    subtopics: [
      {
        title: "Birmingham's Civil Rights Movement",
        description:
          "Learn about Birmingham's role in the Civil Rights Movement, including the 1963 Children's Crusade, which helped lead to the passage of the Civil Rights Act of 1964.",
      },
      {
        title: 'Preserving Historical Sites',
        description:
          "Explore efforts to preserve Birmingham's historical sites, such as the Birmingham Civil Rights Institute, which offers exhibits on the city's history and its impact on Black culture.",
      },
      {
        title: 'Local Historical Narratives',
        description:
          "Discover lesser-known stories of Birmingham's Black community, such as the contributions of local activists and the cultural traditions that have shaped the city's identity.",
      },
    ],
    furtherExploration: [
      {
        title: 'Birmingham Civil Rights Institute',
        link: 'https://www.bcri.org',
        description: "Explore Birmingham's civil rights history.",
      },
      {
        title: 'National Museum of African American History',
        link: 'https://nmaahc.si.edu',
        description: 'Access digital collections on Black history.',
      },
      {
        title: 'PBS: Eyes on the Prize',
        link: 'https://www.pbs.org/wgbh/americanexperience/films/eyesontheprize',
        description: 'Watch a documentary on the Civil Rights Movement.',
      },
    ],
    discussion:
      'History empowers Black youth to reclaim their narratives, but local stories in Birmingham are often overshadowed by national events. This topic encourages youth to critically explore these histories, ensuring diverse voices are heard and contributing to a richer humanities landscape.',
  },
  economics: {
    title: 'Economics',
    description:
      "Examine the economic contributions and challenges faced by African Americans, with a focus on Birmingham's Black business community.",
    image: '/images/black_graduates.webp',
    introduction:
      "Economics explores the economic experiences of African Americans, highlighting Birmingham's history of Black entrepreneurship and the systemic challenges they face. From the historic 4th Avenue Business District to modern initiatives supporting Black-owned businesses, this topic examines how economic empowerment intersects with African American humanities. For Black youth, understanding these dynamics offers tools to address economic disparities and contribute to the humanities through research and advocacy for equitable economic policies.",
    subtopics: [
      {
        title: '4th Avenue Business District',
        description:
          "Learn about Birmingham's 4th Avenue Business District, a historic hub for Black-owned businesses during segregation, and its role in fostering economic independence and community resilience.",
      },
      {
        title: 'Economic Disparities',
        description:
          'Explore the systemic economic challenges faced by African Americans in Birmingham, such as wage gaps and limited access to capital, and how these issues impact community development.',
      },
      {
        title: 'Supporting Black Entrepreneurs',
        description:
          'Discover initiatives in Birmingham, like the Urban Impact program, which support Black entrepreneurs through mentorship, funding, and resources, promoting economic empowerment.',
      },
    ],
    furtherExploration: [
      {
        title: 'Urban Impact Birmingham',
        link: 'https://urbanimpactbirmingham.org',
        description: 'Learn about support for Black entrepreneurs.',
      },
      {
        title: 'National Urban League',
        link: 'https://www.nul.org',
        description: 'Explore economic empowerment programs.',
      },
      {
        title: 'Federal Reserve: Racial Economic Inequality',
        link: 'https://www.federalreserve.gov/econres/racial-inequality.htm',
        description: 'Read about economic disparities.',
      },
    ],
    discussion:
      "Economics provides Black youth with insights into systemic inequities, but local data on Birmingham's Black businesses is often limited. This topic encourages youth to critically analyze economic systems, advocating for change and contributing to the humanities through informed economic discourse.",
  },
  'digital-humanities': {
    title: 'Digital Humanities',
    description:
      'Harness digital tools to explore and preserve African American humanities, amplifying Black voices in Birmingham.',
    image: '/images/data_visualization_.jpg',
    introduction:
      'Digital Humanities uses technology to study and preserve African American culture, history, and narratives, with Birmingham as a focal point for innovation. This topic explores how digital tools like online archives, data visualization, and virtual exhibits can amplify Black voices and make humanities accessible. For Black youth, engaging with digital humanities offers opportunities to document their stories, challenge stereotypes, and contribute to the humanities through innovative, tech-driven approaches.',
    subtopics: [
      {
        title: 'Digital Archiving Projects',
        description:
          'Learn about digital archiving initiatives, such as those at the Birmingham Public Library, which preserve African American history through digitized photographs, documents, and oral histories.',
      },
      {
        title: 'Virtual Exhibits and Storytelling',
        description:
          'Explore how virtual exhibits, like those by the Smithsonian, allow Birmingham youth to create and share digital stories, making African American humanities accessible to a global audience.',
      },
      {
        title: 'Data Visualization in Humanities',
        description:
          'Discover how data visualization can be used to analyze African American history, such as mapping civil rights events in Birmingham, providing new insights into cultural patterns.',
      },
    ],
    furtherExploration: [
      {
        title: 'Digital Public Library of America',
        link: 'https://dp.la',
        description: 'Access digital collections on African American history.',
      },
      {
        title: 'Smithsonian: Digital Humanities',
        link: 'https://www.si.edu/digital',
        description: 'Explore digital humanities projects.',
      },
      {
        title: 'Birmingham Public Library Archives',
        link: 'https://www.bplonline.org/archives',
        description: 'Discover digitized Birmingham history.',
      },
    ],
    discussion:
      'Digital Humanities empowers Black youth to preserve their culture, but access to technology in Birmingham can be a barrier. This topic provides tools and resources, encouraging youth to critically engage with digital methods and contribute to the humanities through innovative storytelling.',
  },
  literature: {
    title: 'Literature',
    description:
      "Dive into African American literature, celebrating Birmingham's literary contributions and their impact on cultural identity.",
    image: '/images/tuskegee_library.jpg',
    introduction:
      'Literature has been a powerful tool for African Americans to articulate their experiences, with Birmingham producing notable writers like Angela Davis and poet Ashley M. Jones. This topic explores the rich tradition of Black literature, from the Harlem Renaissance to contemporary works, focusing on themes of identity, resistance, and community. For Black youth, engaging with literature offers a way to connect with their heritage and contribute to the humanities, using writing to explore their stories and advocate for change.',
    subtopics: [
      {
        title: 'Harlem Renaissance and Beyond',
        description:
          "Learn about the Harlem Renaissance, with writers like Zora Neale Hurston, and how this literary movement influences Birmingham's contemporary authors like Ashley M. Jones.",
      },
      {
        title: "Birmingham's Literary Voices",
        description:
          "Discover local writers like Ashley M. Jones, Alabama's Poet Laureate, whose poetry reflects Birmingham's cultural and historical landscape, addressing themes of race and identity.",
      },
      {
        title: 'Literature as Resistance',
        description:
          'Explore how literature has been used as a form of resistance, with Birmingham writers addressing systemic racism and social justice through their works.',
      },
    ],
    furtherExploration: [
      {
        title: 'Poetry Foundation: Ashley M. Jones',
        link: 'https://www.poetryfoundation.org/poets/ashley-m-jones',
        description: 'Read poetry by Ashley M. Jones.',
      },
      {
        title: 'Schomburg Center for Research in Black Culture',
        link: 'https://www.nypl.org/locations/schomburg',
        description: 'Access African American literature resources.',
      },
      {
        title: 'Library of Congress: African American Literature',
        link: 'https://www.loc.gov/collections/african-american-literature',
        description: 'Explore Black literature collections.',
      },
    ],
    discussion:
      'Literature connects Black youth to their cultural heritage, but local Birmingham writers often lack national recognition. This topic highlights their contributions, encouraging youth to critically engage with literature as a tool for resistance and self-expression, thus enriching the humanities with their voices.',
  },
  art: {
    title: 'Art',
    description: 'Discover the impact of African American art on cultural expression and identity.',
    image: '/images/art_gallery.jpg',
    introduction:
      'African American art represents a rich tapestry of cultural expression, from traditional forms to contemporary innovations. In Birmingham, institutions like the Birmingham Museum of Art showcase works by Black artists that explore themes of identity, history, and social justice. This topic examines how art serves as a medium for storytelling, resistance, and celebration in African American communities, empowering Black youth to express their experiences and contribute to the humanities through visual creativity.',
    subtopics: [
      {
        title: "Birmingham's Black Artists",
        description:
          "Discover local Black artists in Birmingham whose work reflects the city's cultural heritage and addresses contemporary social issues, from painting to sculpture and mixed media.",
      },
      {
        title: 'Art as Social Commentary',
        description:
          'Explore how African American artists use their work to comment on social issues, from the civil rights era to present-day challenges, creating powerful visual narratives that inspire change.',
      },
      {
        title: 'Youth Art Programs',
        description:
          'Learn about programs in Birmingham that engage Black youth in art, such as community workshops and school initiatives, fostering creativity and cultural pride.',
      },
    ],
    furtherExploration: [
      {
        title: 'Birmingham Museum of Art',
        link: 'https://www.artsbma.org',
        description: 'Explore collections featuring Black artists.',
      },
      {
        title: 'National Museum of African American Art',
        link: 'https://www.si.edu/museums/african-art-museum',
        description: 'Discover African American art traditions.',
      },
      {
        title: 'Studio Museum in Harlem',
        link: 'https://www.studiomuseum.org',
        description: 'View contemporary Black art online.',
      },
    ],
    discussion:
      'Art provides Black youth with a powerful medium for self-expression, yet representation in mainstream art institutions remains a challenge. This topic encourages youth to critically engage with visual arts as a form of cultural communication, contributing to the humanities through creative practices that honor their heritage and envision their futures.',
  },
};
