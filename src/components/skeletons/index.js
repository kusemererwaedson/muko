import React from 'react';

// Base skeleton components
export const SkeletonLine = ({ width = '100%', height = '16px', mb = '8px' }) => (
  <div className="skeleton" style={{ height, width, marginBottom: mb }}></div>
);

export const SkeletonCard = ({ children }) => (
  <div className="card">
    <div className="card-body">{children}</div>
  </div>
);

export const SkeletonTable = ({ columns = 5, rows = 5 }) => (
  <div className="table-responsive">
    <table className="table table-striped table-borderless">
      <thead>
        <tr>
          {Array(columns).fill().map((_, i) => (
            <th key={i}><SkeletonLine width="80%" /></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array(rows).fill().map((_, row) => (
          <tr key={row}>
            {Array(columns).fill().map((_, col) => (
              <td key={col}><SkeletonLine width="90%" /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Reusable patterns
export const PageHeaderSkeleton = () => (
  <div className="row">
    <div className="col-md-12 grid-margin">
      <SkeletonLine width="40%" height="24px" />
      <SkeletonLine width="60%" height="16px" />
    </div>
  </div>
);

export const MetricCardsSkeleton = ({ count = 4 }) => (
  <div className="row">
    {Array(count).fill().map((_, i) => (
      <div key={i} className="col-md-3 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="70%" />
          <SkeletonLine width="90%" height="24px" />
        </SkeletonCard>
      </div>
    ))}
  </div>
);

// Fee Management skeletons
export const FeeDashboardSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <MetricCardsSkeleton count={4} />
    <div className="row">
      <div className="col-md-6 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="30%" height="20px" />
          <div style={{height: '250px', padding: '20px'}}>
            <SkeletonLine width="100%" height="200px" />
          </div>
        </SkeletonCard>
      </div>
      <div className="col-md-6 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="25%" height="20px" />
          <SkeletonTable columns={3} rows={4} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

export const FeeTypesSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="25%" height="20px" />
          <SkeletonTable columns={4} rows={6} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

export const FeeGroupsSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="25%" height="20px" />
          <SkeletonTable columns={5} rows={6} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

export const FeeAllocationsSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="30%" height="20px" />
          <SkeletonTable columns={6} rows={8} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

export const FeePaymentsSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="30%" height="20px" />
          <SkeletonTable columns={6} rows={10} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

export const FeeAllocateSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="35%" height="20px" />
          <SkeletonTable columns={7} rows={8} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

export const BulkCollectionSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="40%" height="20px" />
          <div className="row">
            <div className="col-md-6">
              <SkeletonLine width="100%" height="38px" mb="15px" />
            </div>
            <div className="col-md-6">
              <SkeletonLine width="100%" height="38px" mb="15px" />
            </div>
          </div>
          <SkeletonTable columns={5} rows={6} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

export const ReportsSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-6 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="30%" height="20px" />
          <SkeletonLine width="100%" height="150px" />
        </SkeletonCard>
      </div>
      <div className="col-md-6 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="25%" height="20px" />
          <SkeletonTable columns={4} rows={5} />
        </SkeletonCard>
      </div>
    </div>
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="30%" height="20px" />
          <SkeletonTable columns={6} rows={8} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

// Accounting skeletons
export const TransactionsSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="30%" height="20px" />
          <SkeletonTable columns={6} rows={10} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

export const AccountsSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="25%" height="20px" />
          <SkeletonTable columns={4} rows={8} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

export const VoucherHeadsSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="25%" height="20px" />
          <SkeletonTable columns={3} rows={6} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

// Communications skeletons
export const EmailLogsSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="25%" height="20px" />
          <SkeletonTable columns={5} rows={8} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

export const BulkRemindersSkeleton = () => (
  <div className="content-wrapper">
    <PageHeaderSkeleton />
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <SkeletonCard>
          <SkeletonLine width="35%" height="20px" />
          <div className="row">
            <div className="col-md-6">
              <SkeletonLine width="100%" height="38px" mb="15px" />
            </div>
            <div className="col-md-6">
              <SkeletonLine width="100%" height="38px" mb="15px" />
            </div>
          </div>
          <SkeletonLine width="100%" height="100px" mb="15px" />
          <SkeletonTable columns={4} rows={6} />
        </SkeletonCard>
      </div>
    </div>
  </div>
);

// Specific skeletons
export { DashboardSkeleton, StudentsTableSkeleton } from '../Skeleton';