using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Accounting_System_DAL.Models
{
    public partial class softwareContext : DbContext
    {
        public softwareContext()
        {
        }

        public softwareContext(DbContextOptions<softwareContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Card> Cards { get; set; } = null!;
        public virtual DbSet<Category> Categories { get; set; } = null!;
        public virtual DbSet<Classification> Classifications { get; set; } = null!;
        public virtual DbSet<Customer> Customers { get; set; } = null!;
        public virtual DbSet<Customerinvoice> Customerinvoices { get; set; } = null!;
        public virtual DbSet<Provider> Providers { get; set; } = null!;
        public virtual DbSet<Providerinvoice> Providerinvoices { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySql("server=localhost;port=3306;database=software;uid=root;password=ER259333", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.33-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("utf8mb4_0900_ai_ci")
                .HasCharSet("utf8mb4");

            modelBuilder.Entity<Card>(entity =>
            {
                entity.ToTable("cards");

                entity.HasIndex(e => e.CategoryId, "CategoryId");

                entity.Property(e => e.CardName).HasMaxLength(50);

                entity.HasOne(d => d.CategoryNavigation)
                    .WithMany(p => p.Cards)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("cards_ibfk_1");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("categories");

                entity.HasIndex(e => e.CategoryClassification, "CategoryClassification");

                entity.Property(e => e.CategoryName).HasMaxLength(50);

                entity.HasOne(d => d.CategoryClassificationNavigation)
                    .WithMany(p => p.Categories)
                    .HasForeignKey(d => d.CategoryClassification)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("categories_ibfk_1");
            });

            modelBuilder.Entity<Classification>(entity =>
            {
                entity.ToTable("classification");

                entity.Property(e => e.ClassificationName).HasMaxLength(50);
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable("customers");

                entity.Property(e => e.CustomerAddress).HasMaxLength(50);

                entity.Property(e => e.CustomerContactName).HasMaxLength(25);

                entity.Property(e => e.CustomerEmail).HasMaxLength(50);

                entity.Property(e => e.CustomerName).HasMaxLength(50);

                entity.Property(e => e.CustomerPhoneNumber).HasMaxLength(25);

                entity.Property(e => e.CustomerCardNumber);
            });

            modelBuilder.Entity<Customerinvoice>(entity =>
            {
                entity.ToTable("customerinvoices");

                entity.HasIndex(e => e.CardId, "CardId");

                entity.HasIndex(e => e.CustomerId, "CustomerId");

                entity.Property(e => e.CustomerInvoiceDetails).HasMaxLength(50);

                entity.HasOne(d => d.CardNavigation)
                    .WithMany(p => p.Customerinvoices)
                    .HasForeignKey(d => d.CardId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("customerinvoices_ibfk_2");

                entity.HasOne(d => d.CustomerNavigation)
                    .WithMany(p => p.Customerinvoices)
                    .HasForeignKey(d => d.CustomerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("customerinvoices_ibfk_1");
            });

            modelBuilder.Entity<Provider>(entity =>
            {
                entity.ToTable("providers");

                entity.Property(e => e.ProviderAddress).HasMaxLength(50);

                entity.Property(e => e.ProviderCardNumber).HasMaxLength(25);

                entity.Property(e => e.ProviderContactName).HasMaxLength(25);

                entity.Property(e => e.ProviderEmail).HasMaxLength(50);

                entity.Property(e => e.ProviderName).HasMaxLength(50);

                entity.Property(e => e.ProviderPhoneNumber).HasMaxLength(25);
            });

            modelBuilder.Entity<Providerinvoice>(entity =>
            {
                entity.ToTable("providerinvoices");

                entity.HasIndex(e => e.CardId, "CardId");

                entity.HasIndex(e => e.ProviderId, "ProviderId");

                entity.Property(e => e.ProviderInvoiceDetails).HasMaxLength(50);

                entity.HasOne(d => d.Card)
                    .WithMany(p => p.Providerinvoices)
                    .HasForeignKey(d => d.CardId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("providerinvoices_ibfk_2");

                entity.HasOne(d => d.Provider)
                    .WithMany(p => p.Providerinvoices)
                    .HasForeignKey(d => d.ProviderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("providerinvoices_ibfk_1");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
