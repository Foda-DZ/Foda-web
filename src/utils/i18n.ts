export type LanguageCode = 'en' | 'ar';

export const translations: Record<LanguageCode, Record<string, string>> = {
    en: {
        // Meta Ads Header
        'meta.title': '📊 Meta Ads Dashboard',
        'meta.subtitle': 'Manage your Meta advertising campaigns, track performance metrics, and optimize your ad spend across Facebook and Instagram.',

        // Buttons
        'meta.btn.refresh': 'Refresh',
        'meta.btn.syncNow': 'Sync Now',
        'meta.btn.syncing': 'Syncing...',
        'meta.btn.disconnect': 'Disconnect',
        'meta.btn.connectMeta': 'Connect Meta Ads',
        'meta.btn.testEvent': 'Test Event',
        'meta.btn.sendTestEvent': 'Send Test Event',
        'meta.btn.selectAccount': 'Select Account',
        'meta.btn.cancel': 'Cancel',

        // Date Range
        'meta.dateRange.label': 'Date Range',
        'meta.dateRange.custom': 'Use custom date range',
        'meta.dateRange.today': 'Today',
        'meta.dateRange.yesterday': 'Yesterday',
        'meta.dateRange.last_7d': 'Last 7 days',
        'meta.dateRange.last_30d': 'Last 30 days',
        'meta.dateRange.startDate': 'Start Date',
        'meta.dateRange.endDate': 'End Date',

        // KPI Labels
        'meta.kpi.spend': 'Total Spend',
        'meta.kpi.roas': 'Return on Ad Spend (ROAS)',
        'meta.kpi.ctr': 'Click-Through Rate (CTR)',
        'meta.kpi.cpc': 'Cost Per Click (CPC)',
        'meta.kpi.purchases': 'Purchases',
        'meta.kpi.conversions': 'Conversions',
        'meta.kpi.reach': 'Reach',
        'meta.kpi.impressions': 'Impressions',
        'meta.kpi.clicks': 'Clicks',

        // Connection Details
        'meta.connection.title': '🔗 Connection Details',
        'meta.connection.status': 'Connection Status',
        'meta.connection.connected': 'Connected',
        'meta.connection.disconnected': 'Not Connected',
        'meta.connection.adAccount': 'Ad Account',
        'meta.connection.pixelId': 'Pixel ID',
        'meta.connection.trackingKey': 'Tracking Key',
        'meta.connection.lastSync': 'Last Synced',
        'meta.connection.never': 'Never',

        // Campaigns
        'meta.campaigns.title': '📈 Active Campaigns',
        'meta.campaigns.empty': 'No campaigns found. Create a campaign in Meta Business Manager to get started.',
        'meta.campaigns.status': 'Status',
        'meta.campaigns.objective': 'Objective',

        // Events
        'meta.events.title': '📊 Tracked Events',
        'meta.events.empty': 'No events tracked yet. Events will appear here as they are recorded.',
        'meta.events.timestamp': 'Timestamp',
        'meta.events.type': 'Event Type',
        'meta.events.data': 'Event Data',
        'meta.events.view': 'View Details',
        'meta.events.test': 'Test',
        'meta.events.description': 'Real-time tracking of all events sent to your Meta pixel. Test events are marked with a test badge.',

        // Account Selector
        'meta.accounts.title': 'Select Meta Ad Account',
        'meta.accounts.available': 'Available Accounts',
        'meta.accounts.selected': 'Selected Account',
        'meta.accounts.noCurrency': 'N/A',

        // Alert Messages
        'meta.alert.error': 'Error',
        'meta.alert.success': 'Success',
        'meta.alert.notConnected': 'Not Connected',

        // Success/Error Messages
        'meta.message.syncSuccess': '✅ Meta Ads data synced successfully! Your latest performance metrics are now up to date.',
        'meta.message.testEventSent': '✅ Test event sent successfully! Check your Meta Pixel for confirmation in the next few minutes.',
        'meta.message.disconnectSuccess': '✅ Meta Ads disconnected successfully. You can reconnect anytime to resume tracking.',
        'meta.message.syncError': '❌ Failed to sync Meta Ads data. Please check your connection and try again.',
        'meta.message.testEventError': '❌ Failed to send test event. Please ensure your pixel is properly configured.',
        'meta.message.disconnectError': '❌ Failed to disconnect Meta Ads. Please try again or contact support.',
        'meta.message.oauthError': '❌ Failed to start Meta OAuth. Please check your Meta App configuration.',
        'meta.message.pixelConfigHint': '💡 Tip: Ensure you have selected a pixel and page during the setup process.',
        'meta.message.connectGuide': '👉 Click the "Connect Meta Ads" button to link your Meta account and start tracking your advertising performance.',

        // Pixel and Page Selector
        'meta.selectPixelAndPage': 'Select Pixel and Page',
        'meta.adAccount': 'Ad Account',
        'meta.pixels': 'Available Pixels',
        'meta.pages': 'Available Pages',
        'meta.noPixels': 'No pixels found for this account. Create a pixel in Meta Business Manager.',
        'meta.noPages': 'No pages found for this account. Create or connect a Facebook page first.',
        'meta.loading': 'Loading pixels and pages...',
        'meta.saving': 'Saving...',
        'meta.saveConfiguration': 'Save Configuration',

        // Dialog Messages
        'meta.dialog.disconnectTitle': 'Disconnect Meta Ads?',
        'meta.dialog.disconnectMessage': 'Are you sure you want to disconnect Meta Ads? You can reconnect anytime to resume tracking. All historical data will be preserved.',

        // Traffic Analytics
        'traffic.title': '📊 Traffic Source Analytics',
        'traffic.subtitle': 'Track where your visitors come from (Meta, WhatsApp, Direct) and analyze traffic patterns, device usage, and conversion rates.',
        'traffic.dateRange.label': 'Date Range',
        'traffic.dateRange.custom': 'Use custom date range',
        'traffic.dateRange.today': 'Today',
        'traffic.dateRange.yesterday': 'Yesterday',
        'traffic.dateRange.last_7d': 'Last 7 days',
        'traffic.dateRange.last_30d': 'Last 30 days',
        'traffic.dateRange.last_90d': 'Last 90 days',
        'traffic.dateRange.startDate': 'Start Date',
        'traffic.dateRange.endDate': 'End Date',

        // Traffic Metrics
        'traffic.metric.visitors': 'Total Visitors',
        'traffic.metric.pageViews': 'Page Views',
        'traffic.metric.bounceRate': 'Bounce Rate',
        'traffic.metric.avgSessionDuration': 'Avg Session Duration',
        'traffic.metric.conversions': 'Conversions',
        'traffic.metric.conversionRate': 'Conversion Rate',
        'traffic.metric.revenue': 'Revenue',
        'traffic.metric.percentage': 'Percentage',

        // Traffic by Source
        'traffic.bySource.title': '📱 Traffic by Source',
        'traffic.bySource.source': 'Source',
        'traffic.source.meta': 'Meta',
        'traffic.source.whatsapp': 'WhatsApp',
        'traffic.source.direct': 'Direct',
        'traffic.source.other': 'Other',

        // Traffic by Device
        'traffic.byDevice.title': '🖥️ Device Distribution',
        'traffic.device.mobile': 'Mobile',
        'traffic.device.desktop': 'Desktop',
        'traffic.device.tablet': 'Tablet',

        // Traffic Trends
        'traffic.trends.title': '📈 Traffic Trends',
        'traffic.trends.date': 'Date',

        // Common
        'common.refresh': 'Refresh',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
    },
    ar: {
        // Meta Ads Header
        'meta.title': '📊 لوحة تحكم إعلانات Meta',
        'meta.subtitle': 'إدارة حملاتك الإعلانية على Meta، تتبع مقاييس الأداء، وتحسين إنفاقك الإعلاني عبر Facebook و Instagram.',

        // Buttons
        'meta.btn.refresh': 'تحديث',
        'meta.btn.syncNow': 'مزامنة الآن',
        'meta.btn.syncing': 'جاري المزامنة...',
        'meta.btn.disconnect': 'قطع الاتصال',
        'meta.btn.connectMeta': 'توصيل إعلانات Meta',
        'meta.btn.testEvent': 'اختبار الحدث',
        'meta.btn.sendTestEvent': 'إرسال حدث اختبار',
        'meta.btn.selectAccount': 'اختر الحساب',
        'meta.btn.cancel': 'إلغاء',

        // Date Range
        'meta.dateRange.label': 'نطاق التاريخ',
        'meta.dateRange.custom': 'استخدم نطاق تاريخ مخصص',
        'meta.dateRange.today': 'اليوم',
        'meta.dateRange.yesterday': 'أمس',
        'meta.dateRange.last_7d': 'آخر 7 أيام',
        'meta.dateRange.last_30d': 'آخر 30 يوم',
        'meta.dateRange.startDate': 'تاريخ البداية',
        'meta.dateRange.endDate': 'تاريخ النهاية',

        // KPI Labels
        'meta.kpi.spend': 'إجمالي الإنفاق',
        'meta.kpi.roas': 'العائد على الإنفاق الإعلاني',
        'meta.kpi.ctr': 'معدل النقر (CTR)',
        'meta.kpi.cpc': 'تكلفة النقرة (CPC)',
        'meta.kpi.purchases': 'عمليات الشراء',
        'meta.kpi.conversions': 'التحويلات',
        'meta.kpi.reach': 'نطاق الوصول',
        'meta.kpi.impressions': 'مرات الظهور',
        'meta.kpi.clicks': 'النقرات',

        // Connection Details
        'meta.connection.title': '🔗 تفاصيل الاتصال',
        'meta.connection.status': 'حالة الاتصال',
        'meta.connection.connected': 'متصل',
        'meta.connection.disconnected': 'غير متصل',
        'meta.connection.adAccount': 'حساب الإعلانات',
        'meta.connection.pixelId': 'معرف البكسل',
        'meta.connection.trackingKey': 'مفتاح التتبع',
        'meta.connection.lastSync': 'آخر مزامنة',
        'meta.connection.never': 'لم يتم',

        // Campaigns
        'meta.campaigns.title': '📈 الحملات النشطة',
        'meta.campaigns.empty': 'لم يتم العثور على حملات. أنشئ حملة في Meta Business Manager للبدء.',
        'meta.campaigns.status': 'الحالة',
        'meta.campaigns.objective': 'الهدف',

        // Events
        'meta.events.title': '📊 الأحداث المتتبعة',
        'meta.events.empty': 'لم يتم تتبع أي أحداث حتى الآن. ستظهر الأحداث هنا عند تسجيلها.',
        'meta.events.timestamp': 'الوقت والتاريخ',
        'meta.events.type': 'نوع الحدث',
        'meta.events.data': 'بيانات الحدث',
        'meta.events.view': 'عرض التفاصيل',
        'meta.events.test': 'اختبار',
        'meta.events.description': 'تتبع فوري لجميع الأحداث المرسلة إلى بكسل Meta الخاص بك. يتم وضع علامة على أحداث الاختبار.',

        // Account Selector
        'meta.accounts.title': 'اختر حساب إعلانات Meta',
        'meta.accounts.available': 'الحسابات المتاحة',
        'meta.accounts.selected': 'الحساب المحدد',
        'meta.accounts.noCurrency': 'غير متوفر',

        // Alert Messages
        'meta.alert.error': 'خطأ',
        'meta.alert.success': 'نجاح',
        'meta.alert.notConnected': 'غير متصل',

        // Success/Error Messages
        'meta.message.syncSuccess': '✅ تمت مزامنة بيانات إعلانات Meta بنجاح! أحدث مقاييس الأداء لديك محدثة الآن.',
        'meta.message.testEventSent': '✅ تم إرسال حدث الاختبار بنجاح! تحقق من بكسل Meta الخاص بك للتأكيد في الدقائق القادمة.',
        'meta.message.disconnectSuccess': '✅ تم قطع اتصال إعلانات Meta بنجاح. يمكنك إعادة الاتصال في أي وقت لاستئناف التتبع.',
        'meta.message.syncError': '❌ فشل في مزامنة بيانات إعلانات Meta. يرجى التحقق من اتصالك والمحاولة مرة أخرى.',
        'meta.message.testEventError': '❌ فشل في إرسال حدث الاختبار. يرجى التأكد من تكوين بكسلك بشكل صحيح.',
        'meta.message.disconnectError': '❌ فشل في قطع اتصال إعلانات Meta. يرجى المحاولة مرة أخرى أو الاتصال بالدعم.',
        'meta.message.oauthError': '❌ فشل في بدء Meta OAuth. يرجى التحقق من تكوين تطبيق Meta الخاص بك.',
        'meta.message.pixelConfigHint': '💡 نصيحة: تأكد من أنك قد اخترت بكسل وصفحة أثناء عملية الإعداد.',
        'meta.message.connectGuide': '👉 انقر على زر "توصيل إعلانات Meta" لربط حساب Meta الخاص بك وبدء تتبع أداء إعلاناتك.',

        // Pixel and Page Selector
        'meta.selectPixelAndPage': 'اختر البكسل والصفحة',
        'meta.adAccount': 'حساب الإعلانات',
        'meta.pixels': 'البكسلات المتاحة',
        'meta.pages': 'الصفحات المتاحة',
        'meta.noPixels': 'لم يتم العثور على بكسلات لهذا الحساب. أنشئ بكسل في Meta Business Manager.',
        'meta.noPages': 'لم يتم العثور على صفحات لهذا الحساب. أنشئ أو ربط صفحة Facebook أولاً.',
        'meta.loading': 'جاري تحميل البكسلات والصفحات...',
        'meta.saving': 'جاري الحفظ...',
        'meta.saveConfiguration': 'حفظ الإعدادات',

        // Dialog Messages
        'meta.dialog.disconnectTitle': 'قطع اتصال إعلانات Meta؟',
        'meta.dialog.disconnectMessage': 'هل أنت متأكد من أنك تريد قطع اتصال إعلانات Meta؟ يمكنك إعادة الاتصال في أي وقت لاستئناف التتبع. سيتم الحفاظ على جميع البيانات التاريخية.',

        // Traffic Analytics
        'traffic.title': '📊 تحليلات مصادر حركة المرور',
        'traffic.subtitle': 'تتبع مصدر زوارك (Meta، WhatsApp، مباشر) وحلل أنماط حركة المرور واستخدام الأجهزة ومعدلات التحويل.',
        'traffic.dateRange.label': 'نطاق التاريخ',
        'traffic.dateRange.custom': 'استخدم نطاق تاريخ مخصص',
        'traffic.dateRange.today': 'اليوم',
        'traffic.dateRange.yesterday': 'أمس',
        'traffic.dateRange.last_7d': 'آخر 7 أيام',
        'traffic.dateRange.last_30d': 'آخر 30 يوم',
        'traffic.dateRange.last_90d': 'آخر 90 يوم',
        'traffic.dateRange.startDate': 'تاريخ البداية',
        'traffic.dateRange.endDate': 'تاريخ النهاية',

        // Traffic Metrics
        'traffic.metric.visitors': 'إجمالي الزوار',
        'traffic.metric.pageViews': 'عدد مرات عرض الصفحة',
        'traffic.metric.bounceRate': 'معدل الارتداد',
        'traffic.metric.avgSessionDuration': 'متوسط مدة الجلسة',
        'traffic.metric.conversions': 'التحويلات',
        'traffic.metric.conversionRate': 'معدل التحويل',
        'traffic.metric.revenue': 'الإيراد',
        'traffic.metric.percentage': 'النسبة المئوية',

        // Traffic by Source
        'traffic.bySource.title': '📱 حركة المرور حسب المصدر',
        'traffic.bySource.source': 'المصدر',
        'traffic.source.meta': 'Meta',
        'traffic.source.whatsapp': 'WhatsApp',
        'traffic.source.direct': 'مباشر',
        'traffic.source.other': 'آخر',

        // Traffic by Device
        'traffic.byDevice.title': '🖥️ توزيع الأجهزة',
        'traffic.device.mobile': 'جوال',
        'traffic.device.desktop': 'سطح المكتب',
        'traffic.device.tablet': 'جهاز لوحي',

        // Traffic Trends
        'traffic.trends.title': '📈 اتجاهات حركة المرور',
        'traffic.trends.date': 'التاريخ',

        // Common
        'common.refresh': 'تحديث',
        'common.loading': 'جاري التحميل...',
        'common.error': 'خطأ',
        'common.success': 'نجاح',
    },
};

export function t(key: string, lang: LanguageCode = 'en'): string {
    return translations[lang]?.[key] || key;
}

export function getLanguage(): LanguageCode {
    // Try to get from localStorage or document language
    const stored = localStorage.getItem('language') as LanguageCode;
    if (stored && (stored === 'en' || stored === 'ar')) {
        return stored;
    }

    const htmlLang = document.documentElement.lang;
    if (htmlLang.startsWith('ar')) {
        return 'ar';
    }

    return 'en';
}

export function setLanguage(lang: LanguageCode): void {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
}
