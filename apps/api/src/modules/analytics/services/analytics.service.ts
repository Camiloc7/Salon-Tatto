import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private analyticsDataClient: BetaAnalyticsDataClient;
  private propertyId: string;
  private isConfigured: boolean = false;

  constructor() {
    this.propertyId = process.env.GA_PROPERTY_ID || '';
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (this.propertyId && clientEmail && privateKey) {
      try {
        this.analyticsDataClient = new BetaAnalyticsDataClient({
          credentials: {
            client_email: clientEmail,
            private_key: privateKey,
          },
        });
        this.isConfigured = true;
        this.logger.log('Google Analytics Data API configured successfully');
      } catch (error) {
        this.logger.error('Failed to configure Google Analytics client', error);
      }
    } else {
      this.logger.warn('Google Analytics credentials are missing from .env');
    }
  }

  async getTrafficData() {
    // If GA is not configured, return a default mock object to prevent breaking the dashboard
    if (!this.isConfigured) {
      return [
        { name: 'Week 1', visits: 0, unique: 0 },
        { name: 'Week 2', visits: 0, unique: 0 },
        { name: 'Week 3', visits: 0, unique: 0 },
        { name: 'Week 4', visits: 0, unique: 0 }
      ];
    }

    try {
      const [response] = await this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate: '28daysAgo',
            endDate: 'today',
          },
        ],
        dimensions: [
          {
            name: 'date',
          },
        ],
        metrics: [
          {
            name: 'sessions', // Total visits
          },
          {
            name: 'totalUsers', // Unique visitors
          },
        ],
        orderBys: [
          {
            dimension: { dimensionName: 'date' },
            desc: false, // Chronological order
          }
        ]
      });

      // Transform response to match Recharts expected format
      const formattedData = response.rows?.map(row => {
        const rawDate = row.dimensionValues?.[0]?.value || '';
        // Format YYYYMMDD to nice string
        const formattedDate = rawDate.length === 8 
          ? `${rawDate.substring(4, 6)}/${rawDate.substring(6, 8)}` 
          : rawDate;

        return {
          name: formattedDate,
          visits: parseInt(row.metricValues?.[0]?.value || '0', 10),
          unique: parseInt(row.metricValues?.[1]?.value || '0', 10),
        };
      }) || [];

      // If there's no data yet, return some empty placeholders so the chart renders properly
      if (formattedData.length === 0) {
        return [
          { name: 'No data', visits: 0, unique: 0 }
        ];
      }

      return formattedData;
    } catch (error) {
      this.logger.error('Failed to fetch GA4 traffic data', error);
      throw new InternalServerErrorException('Failed to fetch traffic data');
    }
  }
}
