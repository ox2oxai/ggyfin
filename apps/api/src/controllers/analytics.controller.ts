import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AnalyticsRepository } from '../repositories/analytics.repo.js';
import { AnalyticsService } from '../services/analytics.service.js';
import { UserRole } from '@nbfc/shared';
import { requireRole } from '../middleware/auth.js';

const analyticsRepo = new AnalyticsRepository();
const analyticsService = new AnalyticsService();

export async function analyticsRoutes(fastify: FastifyInstance) {
  /**
   * Super Admin, Branch Manager, Authorizer: Executive Overview & P&L
   */
  fastify.get(
    '/overview',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.SYSTEM_ADMIN, UserRole.BRANCH_MANAGER, UserRole.AUTHORIZER)
      ]
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const loans = await analyticsRepo.getRawLoanDataset();
      const summary = analyticsService.computePortfolioSummary(loans);

      return reply.status(200).send({
        success: true,
        statusCode: 200,
        data: summary
      });
    }
  );

  /**
   * Asset Quality, Overdue Aging & RBI PAR Classification
   */
  fastify.get(
    '/asset-quality',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.SYSTEM_ADMIN, UserRole.BRANCH_MANAGER, UserRole.AUTHORIZER)
      ]
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const loans = await analyticsRepo.getRawLoanDataset();
      const aging = analyticsService.computeAssetQualityAging(loans);

      return reply.status(200).send({
        success: true,
        statusCode: 200,
        data: aging
      });
    }
  );

  /**
   * Demographic Diversity & Geographic Risk Heatmap
   */
  fastify.get(
    '/diversity-geography',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.SYSTEM_ADMIN, UserRole.BRANCH_MANAGER, UserRole.AUTHORIZER)
      ]
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const loans = await analyticsRepo.getRawLoanDataset();
      const demographics = analyticsService.computeDemographics(loans);
      const taluks = await analyticsRepo.getTalukClusterMetrics();
      const geoRisk = analyticsService.computeGeographicRisk(taluks);

      return reply.status(200).send({
        success: true,
        statusCode: 200,
        data: {
          demographics,
          geographicRisk: geoRisk
        }
      });
    }
  );

  /**
   * Downloadable CSV: Daily Field Collection Sheet
   */
  fastify.get(
    '/reports/daily-collection',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.SYSTEM_ADMIN, UserRole.BRANCH_MANAGER, UserRole.AUTHORIZER)
      ]
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const records = await analyticsRepo.getDailyCollectionSchedule();
      const csv = analyticsService.generateDailyCollectionCsv(records);

      reply.header('Content-Type', 'text/csv');
      reply.header('Content-Disposition', 'attachment; filename="GGY_Daily_Field_Collection_Sheet.csv"');
      return reply.send(csv);
    }
  );

  /**
   * Downloadable CSV: Monthly Asset Quality & NPA Report
   */
  fastify.get(
    '/reports/asset-quality',
    {
      preHandler: [
        fastify.authenticate,
        requireRole(UserRole.SYSTEM_ADMIN, UserRole.BRANCH_MANAGER, UserRole.AUTHORIZER)
      ]
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const loans = await analyticsRepo.getRawLoanDataset();
      const summary = analyticsService.computePortfolioSummary(loans);
      const aging = analyticsService.computeAssetQualityAging(loans);
      const csv = analyticsService.generateAssetQualityCsv(aging, summary.totalAum);

      reply.header('Content-Type', 'text/csv');
      reply.header('Content-Disposition', 'attachment; filename="GGY_Monthly_Asset_Quality_NPA_Report.csv"');
      return reply.send(csv);
    }
  );
}
