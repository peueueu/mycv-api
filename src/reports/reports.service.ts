import { Injectable } from '@nestjs/common';
import { Prisma, Report } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async report(
    reportWhereUniqueInput: Prisma.ReportWhereUniqueInput,
  ): Promise<Report | null> {
    return this.prisma.report.findUnique({
      where: reportWhereUniqueInput,
    });
  }

  async reports(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ReportWhereUniqueInput;
    where?: Prisma.ReportWhereInput;
    orderBy?: Prisma.ReportOrderByWithRelationInput;
  }): Promise<Report[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.report.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createReport(data: Prisma.ReportCreateInput): Promise<Report> {
    return this.prisma.report.create({
      data,
    });
  }

  async updateReport(params: {
    where: Prisma.ReportWhereUniqueInput;
    data: Prisma.ReportUpdateInput;
  }): Promise<Report> {
    const { where, data } = params;
    return this.prisma.report.update({
      data,
      where,
    });
  }

  async deleteReport(where: Prisma.ReportWhereUniqueInput): Promise<Report> {
    return this.prisma.report.delete({
      where,
    });
  }
}
