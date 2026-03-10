// ─── Shared translation type ──────────────────────────────────────────────────
export type Lang = "ar" | "en";

export interface Translations {
  dir: "rtl" | "ltr";
  nav: {
    announcement: string;
    collections: string;
    women: string;
    men: string;
    kids: string;
    accessories: string;
    newArrivals: string;
    sale: string;
    hot: string;
    shop: string;
    signIn: string;
    myProfile: string;
    myOrders: string;
    signOut: string;
    shopNow: string;
    register: string;
    searchPlaceholder: string;
    search: string;
  };
  hero: {
    slide1: {
      badge: string;
      line1: string;
      line2: string;
      line3: string;
      subtitle: string;
      cta1: string;
      cta2: string;
      statDesigners: string;
      statClients: string;
      statDelivery: string;
      featuredLabel: string;
      featuredName: string;
      featuredPrice: string;
      featuredBadge: string;
      newBadge: string;
      newSub: string;
    };
    slide2: {
      badge: string;
      line1: string;
      line2: string;
      line3: string;
      subtitle: string;
      cta1: string;
      cta2: string;
      statSellers: string;
      statWilayas: string;
      statPayout: string;
    };
  };
  categories: {
    browsBy: string;
    shopBy: string;
    category: string;
    subtitle: string;
    shopNow: string;
    items: {
      women: { name: string; ar: string; count: string };
      men: { name: string; ar: string; count: string };
      kids: { name: string; ar: string; count: string };
      accessories: { name: string; ar: string; count: string };
    };
  };
  products: {
    handpicked: string;
    trending: string;
    thisSeason: string;
    all: string;
    women: string;
    men: string;
    kids: string;
    quickView: string;
    viewAndAdd: string;
    viewAll: string;
  };
  brandStory: {
    ourStory: string;
    bornFrom: string;
    algerianPride: string;
    para1: string;
    para2: string;
    val1Title: string;
    val1Sub: string;
    val2Title: string;
    val2Sub: string;
    val3Title: string;
    val3Sub: string;
    val4Title: string;
    val4Sub: string;
    badgeYears: string;
    badgeLine1: string;
    badgeLine2: string;
    discoverBtn: string;
  };
  newsletter: {
    statCustomers: string;
    statBrands: string;
    statDelivery: string;
    statRating: string;
    labelCustomers: string;
    labelBrands: string;
    labelDelivery: string;
    labelRating: string;
    stayIn: string;
    fashionLoop: string;
    subtitle: string;
    placeholder: string;
    subscribe: string;
    subscribing: string;
    successTitle: string;
    successSub: string;
    privacy: string;
  };
  sellWithUs: {
    tag: string;
    title1: string;
    title2: string;
    subtitle: string;
    step1Title: string;
    step1Sub: string;
    step2Title: string;
    step2Sub: string;
    step3Title: string;
    step3Sub: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    cta: string;
    ctaSub: string;
  };
  footer: {
    tagline: string;
    shopTitle: string;
    companyTitle: string;
    helpTitle: string;
    shopLinks: string[];
    companyLinks: string[];
    helpLinks: string[];
    address: string;
    phone: string;
    email: string;
    copyright: string;
    privacy: string;
    terms: string;
    cookies: string;
  };
  cart: {
    title: string;
    empty: string;
    emptySub: string;
    explore: string;
    addMore: string;
    freeShippingAt: string;
    qualifies: string;
    subtotal: string;
    shipping: string;
    free: string;
    total: string;
    checkout: string;
    continueShopping: string;
    remove: string;
  };
  auth: {
    login: {
      heading: string;
      sub: string;
      tab: string;
      emailPlaceholder: string;
      passwordPlaceholder: string;
      forgotPassword: string;
      submit: string;
      noAccount: string;
      createOne: string;
    };
    register: {
      heading: string;
      sub: string;
      tab: string;
      fullNamePlaceholder: string;
      shopNamePlaceholder: string;
      emailPlaceholder: string;
      passwordPlaceholder: string;
      confirmPlaceholder: string;
      submit: string;
      hasAccount: string;
      signIn: string;
      strength: { weak: string; fair: string; good: string; strong: string };
    };
    reset: {
      heading: string;
      sub: string;
      description: string;
      emailPlaceholder: string;
      submit: string;
      hasPassword: string;
      signIn: string;
      checkEmail: string;
      sentMessage: string;
      backToSignIn: string;
    };
    verify: {
      heading: string;
      sub: string;
      codeSent: string;
      demoNote: string;
      codePlaceholder: string;
      submit: string;
      resend: string;
      invalidCode: string;
      resendSuccess: string;
    };
  };
  shop: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filters: string;
    priceRange: string;
    quickFilters: string;
    onSale: string;
    newArrivals: string;
    inStock: string;
    bestsellers: string;
    all: string;
    showing: string;
    products: string;
    in: string;
    resultsFor: string;
    noProducts: string;
    noProductsSub: string;
    clearFilters: string;
  };
  checkout: {
    title: string;
    backToCart: string;
    delivery: string;
    payment: string;
    review: string;
    success: string;
    deliveryTitle: string;
    deliverySub: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    wilaya: string;
    selectWilaya: string;
    city: string;
    notes: string;
    notesPlaceholder: string;
    nextPayment: string;
    paymentTitle: string;
    paymentSub: string;
    cod: string;
    codSub: string;
    cib: string;
    cibSub: string;
    baridimob: string;
    baridimobSub: string;
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
    baridimobPhone: string;
    nextReview: string;
    reviewTitle: string;
    reviewSub: string;
    deliveryInfo: string;
    paymentMethod: string;
    orderItems: string;
    orderSummary: string;
    subtotal: string;
    shipping: string;
    freeShipping: string;
    total: string;
    placeOrder: string;
    placing: string;
    successTitle: string;
    successSub: string;
    orderNumber: string;
    orderConfirmed: string;
    estDelivery: string;
    deliveryDays: string;
    continueShopping: string;
    backHome: string;
    change: string;
    items: string;
  };
  profile: {
    title: string;
    personalInfo: string;
    security: string;
    orders: string;
    signOut: string;
    account: string;
    myAccount: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    saveChanges: string;
    saving: string;
    infoSubtitle: string;
    infoSaved: string;
    emailLocked: string;
    securitySubtitle: string;
    passwordChanged: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    updatePassword: string;
    updating: string;
    currentPwdPlaceholder: string;
    newPwdPlaceholder: string;
    confirmPwdPlaceholder: string;
    ordersSubtitle: string;
    noOrders: string;
    noOrdersSub: string;
    startShopping: string;
    memberSince: string;
    edit: string;
    cancel: string;
    loadingOrders: string;
    ordersError: string;
    retry: string;
    orderPlaced: string;
    statusPending: string;
    statusConfirmed: string;
    statusShipped: string;
    statusDelivered: string;
    statusCancelled: string;
    homeDelivery: string;
    deskPickup: string;
  };
  common: {
    dzd: string;
    free: string;
    back: string;
    next: string;
    loading: string;
    required: string;
    invalidEmail: string;
  };
}

// ─── Arabic ───────────────────────────────────────────────────────────────────
export const ar: Translations = {
  dir: "rtl",
  nav: {
    announcement: "توصيل مجاني عبر الجزائر على الطلبات التي تتجاوز 5000 دج  |  مجموعة جديدة: ربيع 2024",
    collections: "المجموعات",
    women: "نساء",
    men: "رجال",
    kids: "أطفال",
    accessories: "إكسسوارات",
    newArrivals: "وصل حديثاً",
    sale: "تخفيضات",
    hot: "رائج",
    shop: "المتجر",
    signIn: "تسجيل الدخول",
    myProfile: "ملفي الشخصي",
    myOrders: "طلباتي",
    signOut: "تسجيل الخروج",
    shopNow: "تسوق الآن",
    register: "إنشاء حساب",
    searchPlaceholder: "ابحث عن منتج، ماركة...",
    search: "بحث",
  },
  hero: {
    slide1: {
      badge: "مجموعة 2024 الجديدة",
      line1: "الأزياء",
      line2: "الجزائرية،",
      line3: "بأسلوب عصري",
      subtitle: "اكتشف أين تلتقي التقاليد بالأناقة العصرية. مصممون جزائريون حصريون، مختارون بعناية لك.",
      cta1: "استكشف المجموعة",
      cta2: "شاهد الفيلم",
      statDesigners: "بائع نشط",
      statClients: "متسوق سعيد",
      statDelivery: "متوسط التوصيل",
      featuredLabel: "إطلالة مميزة",
      featuredName: "أناقة الصيف",
      featuredPrice: "12,500 دج",
      featuredBadge: "جديد",
      newBadge: "وصل حديثاً",
      newSub: "+120 قطعة جديدة",
    },
    slide2: {
      badge: "انضم كبائع",
      line1: "بيع",
      line2: "تصاميمك،",
      line3: "لكل الجزائر",
      subtitle: "انضم إلى أسرع سوق أزياء متنامٍ في الجزائر. أدرج منتجاتك وابدأ البيع لآلاف العملاء اليوم.",
      cta1: "ابدأ البيع",
      cta2: "اعرف المزيد",
      statSellers: "بائع نشط",
      statWilayas: "ولاية تُغطى",
      statPayout: "متوسط الدفع",
    },
  },
  categories: {
    browsBy: "تصفح حسب",
    shopBy: "تسوق حسب",
    category: "الفئة",
    subtitle: "اكتشف مجموعات مختارة بعناية من أمهر المصممين الجزائريين والحرفيين التقليديين.",
    shopNow: "تسوق الآن",
    items: {
      women: { name: "نساء", ar: "نساء", count: "أكثر من 1,240 تصميم" },
      men: { name: "رجال", ar: "رجال", count: "أكثر من 820 تصميم" },
      kids: { name: "أطفال", ar: "أطفال", count: "أكثر من 320 تصميم" },
      accessories: { name: "إكسسوارات", ar: "إكسسوارات", count: "أكثر من 340 قطعة" },
    },
  },
  products: {
    handpicked: "مختار خصيصاً لك",
    trending: "رائج",
    thisSeason: "هذا الموسم",
    all: "الكل",
    women: "نساء",
    men: "رجال",
    kids: "أطفال",
    quickView: "معاينة سريعة",
    viewAndAdd: "عرض وإضافة للسلة",
    viewAll: "عرض كل {count} منتج",
  },
  brandStory: {
    ourStory: "منصتنا",
    bornFrom: "نربط البائعين",
    algerianPride: "بالمتسوقين",
    para1: "فودة هي السوق الإلكتروني الأول للأزياء في الجزائر، صُمّم ليكون جسراً بين المصممين المحليين الموهوبين ومحبّي الموضة في أنحاء البلاد.",
    para2: "سواء كنت مشترياً يكتشف روعة الأزياء الجزائرية، أو بائعاً يرغب في تنمية علامته التجارية، توفر لك فودة الأدوات والانتشار والمجتمع للنجاح.",
    val1Title: "بائعون موثّقون",
    val1Sub: "كل بائع يخضع للتحقق لضمان الجودة والأصالة.",
    val2Title: "حماية المشتري",
    val2Sub: "تسوّق بثقة. مدفوعات آمنة وإرجاع سهل.",
    val3Title: "وصول لكل الجزائر",
    val3Sub: "التوصيل للعملاء في جميع الولايات الـ58.",
    val4Title: "أدوات نمو البائع",
    val4Sub: "لوحة تحكم متكاملة وتحليلات وإدارة الطلبات.",
    badgeYears: "+500",
    badgeLine1: "بائع نشط",
    badgeLine2: "على المنصة",
    discoverBtn: "استكشف المنصة",
  },
  newsletter: {
    statCustomers: "+50 ألف",
    statBrands: "+500",
    statDelivery: "58",
    statRating: "4.8★",
    labelCustomers: "متسوق سعيد",
    labelBrands: "بائع موثّق",
    labelDelivery: "ولاية مُغطّاة",
    labelRating: "تقييم المنصة",
    stayIn: "ابقَ على",
    fashionLoop: "موجة الموضة",
    subtitle: "اشترك للحصول على أحدث الإصدارات الحصرية وأبرز المصممين والعروض المميزة لعشاق الأزياء في الجزائر.",
    placeholder: "أدخل بريدك الإلكتروني",
    subscribe: "اشترك",
    subscribing: "جارٍ الاشتراك...",
    successTitle: "أنت الآن معنا!",
    successSub: "مرحباً بك في الدائرة الداخلية لفودة.",
    privacy: "لا رسائل مزعجة. يمكنك إلغاء الاشتراك في أي وقت. نحن نحترم خصوصيتك.",
  },
  sellWithUs: {
    tag: "انضم كبائع",
    title1: "ابدأ البيع على",
    title2: "فودة اليوم",
    subtitle: "انضم إلى أكثر من 500 بائع يُنمّون أعمالهم على أول سوق أزياء في الجزائر.",
    step1Title: "إعداد سهل وسريع",
    step1Sub: "أنشئ متجرك في دقائق. أدرج منتجاتك وابدأ البيع فوراً.",
    step2Title: "وصول لكل الجزائر",
    step2Sub: "تواصل مع عشاق الموضة في 58 ولاية.",
    step3Title: "إدارة كل شيء",
    step3Sub: "لوحة تحكم قوية لمتابعة الطلبات والمخزون والأرباح.",
    stat1Value: "+500",
    stat1Label: "بائع نشط",
    stat2Value: "+20 ألف",
    stat2Label: "منتج مدرج",
    stat3Value: "58",
    stat3Label: "ولاية مُغطّاة",
    cta: "إنشاء حساب بائع",
    ctaSub: "مجاني تماماً — ابدأ اليوم",
  },
  footer: {
    tagline: "وجهة الأزياء الجزائرية الأولى. نربطك بأفضل المصممين المحليين، من القصبة التاريخية إلى شوارع الجزائر الحديثة.",
    shopTitle: "المتجر",
    companyTitle: "الشركة",
    helpTitle: "المساعدة",
    shopLinks: ["وصل حديثاً", "مجموعة النساء", "مجموعة الرجال", "أطفال", "إكسسوارات", "تخفيضات"],
    companyLinks: ["عن فودة", "الاستدامة", "الصحافة", "وظائف", "المدونة"],
    helpLinks: ["الأسئلة الشائعة", "الشحن والإرجاع", "دليل المقاسات", "تتبع الطلب", "تواصل معنا", "بطاقات الهدايا"],
    address: "15 شارع ديدوش مراد، وسط الجزائر، الجزائر",
    phone: "+213 (0) 21 XX XX XX",
    email: "hello@foda.dz",
    copyright: "© {year} فودة. جميع الحقوق محفوظة. صُنع بـ ❤️ في الجزائر.",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    cookies: "سياسة ملفات تعريف الارتباط",
  },
  cart: {
    title: "سلة التسوق",
    empty: "سلتك فارغة",
    emptySub: "أضف بعض القطع الجميلة للبدء",
    explore: "استكشف المجموعة",
    addMore: "أضف {amount} دج للحصول على توصيل مجاني",
    freeShippingAt: "مجاني",
    qualifies: "أنت مؤهل للتوصيل المجاني!",
    subtotal: "الإجمالي الجزئي",
    shipping: "الشحن",
    free: "مجاناً",
    total: "الإجمالي",
    checkout: "متابعة الدفع",
    continueShopping: "مواصلة التسوق",
    remove: "إزالة",
  },
  auth: {
    login: {
      heading: "مرحباً بعودتك",
      sub: "سجل الدخول إلى حساب فودة الخاص بك",
      tab: "تسجيل الدخول",
      emailPlaceholder: "example@email.com",
      passwordPlaceholder: "كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      submit: "تسجيل الدخول",
      noAccount: "ليس لديك حساب؟",
      createOne: "أنشئ واحداً",
    },
    register: {
      heading: "انضم إلى فودة",
      sub: "أنشئ حسابك — مجاناً تماماً",
      tab: "إنشاء حساب",
      fullNamePlaceholder: "الاسم الكامل",
      shopNamePlaceholder: "اسم المتجر",
      emailPlaceholder: "example@email.com",
      passwordPlaceholder: "8 أحرف على الأقل",
      confirmPlaceholder: "أعد كلمة المرور",
      submit: "إنشاء الحساب",
      hasAccount: "لديك حساب بالفعل؟",
      signIn: "سجل الدخول",
      strength: { weak: "ضعيفة", fair: "مقبولة", good: "جيدة", strong: "قوية" },
    },
    reset: {
      heading: "استعادة كلمة المرور",
      sub: "سنرسل لك رابطاً لإعادة التعيين",
      description: "أدخل عنوان البريد الإلكتروني المرتبط بحساب فودة الخاص بك وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.",
      emailPlaceholder: "example@email.com",
      submit: "إرسال رابط الاستعادة",
      hasPassword: "تذكرت كلمة المرور؟",
      signIn: "تسجيل الدخول",
      checkEmail: "تحقق من بريدك الإلكتروني",
      sentMessage: "إذا كان البريد الإلكتروني {email} مسجلاً، فقد أرسلنا رابط الاستعادة.",
      backToSignIn: "العودة لتسجيل الدخول",
    },
    verify: {
      heading: "تحقق من بريدك الإلكتروني",
      sub: "أدخل الرمز المرسل إلى بريدك",
      codeSent: "تم إرسال رمز مكون من 6 أرقام إلى",
      demoNote: "تجريبي — رمزك هو",
      codePlaceholder: "000000",
      submit: "تأكيد الحساب",
      resend: "إعادة إرسال الرمز",
      invalidCode: "الرمز غير صحيح، حاول مجدداً.",
      resendSuccess: "تم إرسال رمز جديد.",
    },
  },
  shop: {
    title: "اكتشف مجموعتنا",
    subtitle: "أكثر من {count} قطعة من أفضل المصممين الجزائريين",
    searchPlaceholder: "ابحث عن منتجات وعلامات...",
    filters: "تصفية",
    priceRange: "نطاق السعر (دج)",
    quickFilters: "تصفية سريعة",
    onSale: "تخفيضات",
    newArrivals: "وصل حديثاً",
    inStock: "متوفر",
    bestsellers: "الأكثر مبيعاً",
    all: "الكل",
    showing: "يعرض",
    products: "منتجات",
    in: "في",
    resultsFor: "نتائج لـ",
    noProducts: "لا توجد منتجات",
    noProductsSub: "حاول تعديل الفلاتر أو مصطلح البحث",
    clearFilters: "مسح الفلاتر",
  },
  checkout: {
    title: "الدفع",
    backToCart: "العودة للسلة",
    delivery: "التوصيل",
    payment: "الدفع",
    review: "المراجعة",
    success: "ناجح",
    deliveryTitle: "معلومات التوصيل",
    deliverySub: "أين نوصل طلبك؟",
    firstName: "الاسم الأول",
    lastName: "اللقب",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    address: "العنوان",
    wilaya: "الولاية",
    selectWilaya: "اختر الولاية",
    city: "الحي / البلدية",
    notes: "ملاحظات (اختياري)",
    notesPlaceholder: "أي تعليمات خاصة للتوصيل...",
    nextPayment: "التالي: الدفع",
    paymentTitle: "طريقة الدفع",
    paymentSub: "جميع المعاملات آمنة ومشفرة.",
    cod: "الدفع عند الاستلام",
    codSub: "ادفع نقداً عند تسليم طلبك",
    cib: "بطاقة CIB البنكية",
    cibSub: "Visa وMastercard والبطاقات الوطنية",
    baridimob: "بريدي موب",
    baridimobSub: "دفع عبر تطبيق بريد الجزائر",
    cardNumber: "رقم البطاقة",
    cardName: "الاسم على البطاقة",
    expiry: "تاريخ الانتهاء",
    cvv: "رمز الأمان",
    baridimobPhone: "رقم هاتف بريدي موب",
    nextReview: "التالي: المراجعة",
    reviewTitle: "راجع طلبك",
    reviewSub: "تحقق من تفاصيل طلبك قبل التأكيد.",
    deliveryInfo: "معلومات التوصيل",
    paymentMethod: "طريقة الدفع",
    orderItems: "المنتجات",
    orderSummary: "ملخص الطلب",
    subtotal: "الإجمالي الجزئي",
    shipping: "الشحن",
    freeShipping: "مجاناً",
    total: "الإجمالي",
    placeOrder: "تأكيد الطلب",
    placing: "جارٍ معالجة الطلب...",
    successTitle: "تم تأكيد طلبك!",
    successSub: "شكراً لتسوقك من فودة. سيصلك طلبك قريباً.",
    orderNumber: "رقم الطلب",
    orderConfirmed: "تأكيد الطلب",
    estDelivery: "التوصيل المتوقع",
    deliveryDays: "خلال 48-72 ساعة",
    continueShopping: "مواصلة التسوق",
    backHome: "العودة للرئيسية",
    change: "تعديل",
    items: "منتجات",
  },
  profile: {
    title: "ملفي الشخصي",
    personalInfo: "المعلومات الشخصية",
    security: "الأمان",
    orders: "الطلبات",
    signOut: "تسجيل الخروج",
    account: "الحساب",
    myAccount: "حسابي",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    address: "العنوان",
    saveChanges: "حفظ التغييرات",
    saving: "جارٍ الحفظ...",
    infoSubtitle: "تحديث اسمك وبياناتك الشخصية.",
    infoSaved: "تم تحديث الملف الشخصي بنجاح.",
    emailLocked: "لا يمكن تغيير البريد الإلكتروني.",
    securitySubtitle: "غيّر كلمة مرورك لحماية حسابك.",
    passwordChanged: "تم تغيير كلمة المرور بنجاح.",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    updatePassword: "تحديث كلمة المرور",
    updating: "جارٍ التحديث...",
    currentPwdPlaceholder: "كلمة مرورك الحالية",
    newPwdPlaceholder: "٨ أحرف على الأقل",
    confirmPwdPlaceholder: "أعد كلمة المرور الجديدة",
    ordersSubtitle: "تتبع طلباتك السابقة وتفاصيلها.",
    noOrders: "لا توجد طلبات بعد",
    noOrdersSub: "بمجرد تقديم طلب، ستجده هنا.",
    startShopping: "ابدأ التسوق",
    memberSince: "عضو منذ",
    edit: "تعديل",
    cancel: "إلغاء",
    loadingOrders: "جارٍ تحميل الطلبات...",
    ordersError: "تعذر تحميل الطلبات. حاول مجدداً.",
    retry: "إعادة المحاولة",
    orderPlaced: "بتاريخ",
    statusPending: "قيد الانتظار",
    statusConfirmed: "تم التأكيد",
    statusShipped: "تم الشحن",
    statusDelivered: "تم التوصيل",
    statusCancelled: "ملغى",
    homeDelivery: "توصيل للمنزل",
    deskPickup: "استلام من المكتب",
  },
  common: {
    dzd: "دج",
    free: "مجاناً",
    back: "رجوع",
    next: "التالي",
    loading: "جارٍ التحميل...",
    required: "مطلوب.",
    invalidEmail: "أدخل بريداً إلكترونياً صحيحاً.",
  },
};

// ─── English ──────────────────────────────────────────────────────────────────
export const en: Translations = {
  dir: "ltr",
  nav: {
    announcement: "Free shipping across Algeria on orders over 5000 DZD  |  New collection: Spring 2024",
    collections: "Collections",
    women: "Women",
    men: "Men",
    kids: "Kids",
    accessories: "Accessories",
    newArrivals: "New Arrivals",
    sale: "Sale",
    hot: "HOT",
    shop: "Shop",
    signIn: "Sign In",
    myProfile: "My Profile",
    myOrders: "My Orders",
    signOut: "Sign Out",
    shopNow: "Shop Now",
    register: "Register",
    searchPlaceholder: "Search products, brands...",
    search: "Search",
  },
  hero: {
    slide1: {
      badge: "New Collection 2024",
      line1: "Algerian",
      line2: "Fashion,",
      line3: "Redefined",
      subtitle: "Discover where tradition meets modern elegance. Exclusive Algerian designers, curated for you.",
      cta1: "Explore Collection",
      cta2: "Watch Film",
      statDesigners: "Active Sellers",
      statClients: "Happy Shoppers",
      statDelivery: "Avg. Delivery",
      featuredLabel: "Featured Look",
      featuredName: "Summer Elegance",
      featuredPrice: "12,500 DZD",
      featuredBadge: "NEW",
      newBadge: "Just Dropped",
      newSub: "+120 new items",
    },
    slide2: {
      badge: "Join as a Seller",
      line1: "Sell Your",
      line2: "Designs,",
      line3: "Nationwide",
      subtitle: "Join Algeria's fastest-growing fashion marketplace. List your products and reach thousands of customers today.",
      cta1: "Start Selling",
      cta2: "Learn More",
      statSellers: "Active Sellers",
      statWilayas: "Wilayas Covered",
      statPayout: "Avg. Payout",
    },
  },
  categories: {
    browsBy: "Browse By",
    shopBy: "Shop By",
    category: "Category",
    subtitle: "Discover handpicked collections from Algeria's finest designers and traditional craftspeople.",
    shopNow: "Shop Now",
    items: {
      women: { name: "Women", ar: "نساء", count: "1,240+ styles" },
      men: { name: "Men", ar: "رجال", count: "820+ styles" },
      kids: { name: "Kids", ar: "أطفال", count: "320+ styles" },
      accessories: { name: "Accessories", ar: "إكسسوارات", count: "340+ items" },
    },
  },
  products: {
    handpicked: "Handpicked For You",
    trending: "Trending",
    thisSeason: "This Season",
    all: "All",
    women: "Women",
    men: "Men",
    kids: "Kids",
    quickView: "Quick View",
    viewAndAdd: "View & Add to Cart",
    viewAll: "View All {count} Products",
  },
  brandStory: {
    ourStory: "Our Platform",
    bornFrom: "Connecting",
    algerianPride: "Algerian Fashion",
    para1: "Foda is Algeria's premier multi-seller fashion marketplace, built to bridge the gap between talented local designers and style-conscious shoppers across the country.",
    para2: "Whether you're a buyer discovering Algeria's finest fashion or a seller growing your brand, Foda gives you the tools, the reach, and the community to thrive.",
    val1Title: "Verified Sellers",
    val1Sub: "Every seller is vetted to ensure quality and authenticity for buyers.",
    val2Title: "Buyer Protection",
    val2Sub: "Shop with confidence. Secure payments, easy returns, and buyer guarantees.",
    val3Title: "Nationwide Reach",
    val3Sub: "Sellers deliver to customers across all 58 wilayas of Algeria.",
    val4Title: "Seller Growth Tools",
    val4Sub: "Dedicated dashboard, analytics, product management, and order tracking.",
    badgeYears: "500+",
    badgeLine1: "Active Sellers",
    badgeLine2: "on the Platform",
    discoverBtn: "Explore the Platform",
  },
  newsletter: {
    statCustomers: "50K+",
    statBrands: "500+",
    statDelivery: "58",
    statRating: "4.8★",
    labelCustomers: "Happy Shoppers",
    labelBrands: "Verified Sellers",
    labelDelivery: "Wilayas Covered",
    labelRating: "Platform Rating",
    stayIn: "Stay in the",
    fashionLoop: "Fashion Loop",
    subtitle: "Subscribe for exclusive drops, designer spotlights, and special offers tailored for Algeria's fashion lovers.",
    placeholder: "Enter your email address",
    subscribe: "Subscribe",
    subscribing: "Subscribing…",
    successTitle: "You're in!",
    successSub: "Welcome to Foda's inner circle.",
    privacy: "No spam. Unsubscribe anytime. We respect your privacy.",
  },
  sellWithUs: {
    tag: "Sell on Foda",
    title1: "Start Selling on",
    title2: "Foda Today",
    subtitle: "Join 500+ sellers already growing their business on Algeria's premier fashion marketplace.",
    step1Title: "Simple Setup",
    step1Sub: "Create your store in minutes. List products and start selling today.",
    step2Title: "Reach Customers Nationwide",
    step2Sub: "Connect with fashion lovers across all 58 wilayas of Algeria.",
    step3Title: "Manage Everything",
    step3Sub: "Powerful dashboard to track orders, stock, and earnings in real time.",
    stat1Value: "500+",
    stat1Label: "Active Sellers",
    stat2Value: "20K+",
    stat2Label: "Products Listed",
    stat3Value: "58",
    stat3Label: "Wilayas Covered",
    cta: "Create Seller Account",
    ctaSub: "100% Free — Start today",
  },
  footer: {
    tagline: "Algeria's premier fashion marketplace. Connecting you with the finest local designers, from the historic Casbah to the modern streets of Alger.",
    shopTitle: "Shop",
    companyTitle: "Company",
    helpTitle: "Help",
    shopLinks: ["New Arrivals", "Women's Collection", "Men's Collection", "Kids", "Accessories", "Sale"],
    companyLinks: ["About Foda", "Sustainability", "Press", "Careers", "Blog"],
    helpLinks: ["FAQ", "Shipping & Returns", "Size Guide", "Track Order", "Contact Us", "Gift Cards"],
    address: "15 Rue Didouche Mourad, Alger Centre, Algeria",
    phone: "+213 (0) 21 XX XX XX",
    email: "hello@foda.dz",
    copyright: "© {year} Foda. All rights reserved. Made with ❤️ in Algeria.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookies: "Cookie Policy",
  },
  cart: {
    title: "Your Cart",
    empty: "Your cart is empty",
    emptySub: "Add some beautiful pieces to get started",
    explore: "Explore Collection",
    addMore: "Add {amount} DZD more for free shipping",
    freeShippingAt: "FREE",
    qualifies: "You qualify for free shipping!",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    checkout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    remove: "Remove",
  },
  auth: {
    login: {
      heading: "Welcome Back",
      sub: "Sign in to your Foda account",
      tab: "Sign In",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "Your password",
      forgotPassword: "Forgot password?",
      submit: "Sign In",
      noAccount: "Don't have an account?",
      createOne: "Create one",
    },
    register: {
      heading: "Join Foda",
      sub: "Create your account — it's free",
      tab: "Register",
      fullNamePlaceholder: "Full name",
      shopNamePlaceholder: "Shop name",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "Min. 8 characters",
      confirmPlaceholder: "Repeat password",
      submit: "Create Account",
      hasAccount: "Already have an account?",
      signIn: "Sign in",
      strength: { weak: "Weak", fair: "Fair", good: "Good", strong: "Strong" },
    },
    reset: {
      heading: "Reset Password",
      sub: "We'll send you a link to reset it",
      description: "Enter the email address linked to your Foda account and we'll send you a password reset link.",
      emailPlaceholder: "you@example.com",
      submit: "Send Reset Link",
      hasPassword: "Remember your password?",
      signIn: "Sign in",
      checkEmail: "Check your email",
      sentMessage: "If {email} is registered, we've sent a reset link.",
      backToSignIn: "Back to Sign In",
    },
    verify: {
      heading: "Verify Your Email",
      sub: "Enter the code we sent you",
      codeSent: "A 6-digit code was sent to",
      demoNote: "Demo — your code is",
      codePlaceholder: "000000",
      submit: "Verify Account",
      resend: "Resend code",
      invalidCode: "Invalid code, please try again.",
      resendSuccess: "A new code has been sent.",
    },
  },
  shop: {
    title: "Discover Our Collection",
    subtitle: "{count} pieces from Algeria's finest designers",
    searchPlaceholder: "Search products, brands...",
    filters: "Filters",
    priceRange: "Price Range (DZD)",
    quickFilters: "Quick Filters",
    onSale: "On Sale",
    newArrivals: "New Arrivals",
    inStock: "In Stock",
    bestsellers: "Bestsellers",
    all: "All",
    showing: "Showing",
    products: "products",
    in: "in",
    resultsFor: "Results for",
    noProducts: "No products found",
    noProductsSub: "Try adjusting your filters or search term",
    clearFilters: "Clear Filters",
  },
  checkout: {
    title: "Checkout",
    backToCart: "Back to Cart",
    delivery: "Delivery",
    payment: "Payment",
    review: "Review",
    success: "Success",
    deliveryTitle: "Delivery Information",
    deliverySub: "Where should we deliver your order?",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone Number",
    address: "Address",
    wilaya: "Wilaya",
    selectWilaya: "Select Wilaya",
    city: "Neighbourhood / Municipality",
    notes: "Notes (optional)",
    notesPlaceholder: "Any special delivery instructions…",
    nextPayment: "Next: Payment",
    paymentTitle: "Payment Method",
    paymentSub: "All transactions are secured and encrypted.",
    cod: "Cash on Delivery",
    codSub: "Pay cash when your order is delivered",
    cib: "CIB Bank Card",
    cibSub: "Visa, Mastercard & national cards",
    baridimob: "BaridiMob",
    baridimobSub: "Algérie Poste mobile payment",
    cardNumber: "Card Number",
    cardName: "Name on Card",
    expiry: "Expiry Date",
    cvv: "CVV",
    baridimobPhone: "BaridiMob Phone Number",
    nextReview: "Next: Review",
    reviewTitle: "Review Your Order",
    reviewSub: "Check your order details before confirming.",
    deliveryInfo: "Delivery Info",
    paymentMethod: "Payment Method",
    orderItems: "Items",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    freeShipping: "Free",
    total: "Total",
    placeOrder: "Place Order",
    placing: "Processing order…",
    successTitle: "Order Confirmed!",
    successSub: "Thank you for shopping at Foda. Your order is on its way.",
    orderNumber: "Order Number",
    orderConfirmed: "Order Confirmed",
    estDelivery: "Estimated Delivery",
    deliveryDays: "Within 48–72 hours",
    continueShopping: "Continue Shopping",
    backHome: "Back to Home",
    change: "Change",
    items: "items",
  },
  profile: {
    title: "My Profile",
    personalInfo: "Personal Info",
    security: "Security",
    orders: "Orders",
    signOut: "Sign Out",
    account: "Account",
    myAccount: "My Account",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    saveChanges: "Save Changes",
    saving: "Saving…",
    infoSubtitle: "Update your name and contact details.",
    infoSaved: "Profile updated successfully.",
    emailLocked: "Email address cannot be changed.",
    securitySubtitle: "Change your password to keep your account secure.",
    passwordChanged: "Password changed successfully.",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updatePassword: "Update Password",
    updating: "Updating…",
    currentPwdPlaceholder: "Your current password",
    newPwdPlaceholder: "Min. 8 characters",
    confirmPwdPlaceholder: "Repeat new password",
    ordersSubtitle: "Track and manage your past orders.",
    noOrders: "No orders yet",
    noOrdersSub: "Once you place an order, it will appear here.",
    startShopping: "Start Shopping",
    memberSince: "Member since",
    edit: "Edit",
    cancel: "Cancel",
    loadingOrders: "Loading orders…",
    ordersError: "Failed to load orders. Please try again.",
    retry: "Retry",
    orderPlaced: "Placed on",
    statusPending: "Pending",
    statusConfirmed: "Confirmed",
    statusShipped: "Shipped",
    statusDelivered: "Delivered",
    statusCancelled: "Cancelled",
    homeDelivery: "Home Delivery",
    deskPickup: "Desk Pickup",
  },
  common: {
    dzd: "DZD",
    free: "Free",
    back: "Back",
    next: "Next",
    loading: "Loading…",
    required: "Required.",
    invalidEmail: "Enter a valid email.",
  },
};

export const translations: Record<Lang, Translations> = { ar, en };
